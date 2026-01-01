import React, { useState, useEffect, useRef, useMemo } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc, setDoc, limit } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Teacher, ChatMessage, ChatUser, Group, Supervisor, Parent, Student } from '../types'; // Import Parent and Student

interface ChatPageProps {
    currentUser: { uid: string; role: string; name: string };
    teachers: Teacher[];
    groups: Group[];
    students?: Student[];
    parents?: Parent[]; // Added parents prop
    supervisors?: Supervisor[];
    onBack: () => void;
    initialSelectedUserId?: string; // Optional: Auto-select this user on mount
}

const SECTIONS = [
    { id: 'group-quran', name: '📢 مجموعة القرآن', keyword: 'قرآن' },
    { id: 'group-noor-bayan', name: '📢 مجموعة نور البيان', keyword: 'نور بيان' },
    { id: 'group-talqeen', name: '📢 مجموعة التلقين', keyword: 'تلقين' },
    { id: 'group-eqraa', name: '📢 مجموعة الإقراء', keyword: 'إقراء' },
    { id: 'group-all', name: '📢 جميع المدرسين', keyword: 'all' },
];

// Helper function to format "last seen" time
const formatLastSeen = (timestamp: any): string => {
    if (!timestamp) return 'غير متصل';

    try {
        const lastSeenTime = timestamp.toDate?.() || new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - lastSeenTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMinutes < 1) {
            return 'نشط الآن';
        }
        if (diffMinutes < 60) {
            return `منذ ${diffMinutes} د`;
        }
        if (diffHours < 24) {
            return `منذ ${diffHours} س`;
        }
        if (diffDays === 1) {
            return 'أمس';
        }
        if (diffDays < 7) {
            return `منذ ${diffDays} أيام`;
        }

        // Format: 12 ديسمبر
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const dateNum = lastSeenTime.getDate();
        const monthName = months[lastSeenTime.getMonth()];
        return `${dateNum} ${monthName}`;
    } catch {
        return 'غير متصل';
    }
};

// Helper function to format date separator
const getDateSeparatorText = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateToCheck.getTime() === todayDate.getTime()) {
        return 'اليوم';
    }
    if (dateToCheck.getTime() === yesterdayDate.getTime()) {
        return 'أمس';
    }

    // Format: يوم الجمعة، 12 ديسمبر 2024
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dateNum = date.getDate();
    const year = date.getFullYear();

    return `${dayName}، ${dateNum} ${monthName} ${year}`;
};

// Helper function to check if date changed between messages
const isDateChanged = (currentMsg: ChatMessage, previousMsg: ChatMessage | undefined): boolean => {
    if (!previousMsg) return true;

    const currentDate = currentMsg.timestamp?.seconds
        ? new Date(currentMsg.timestamp.seconds * 1000)
        : new Date();
    const previousDate = previousMsg.timestamp?.seconds
        ? new Date(previousMsg.timestamp.seconds * 1000)
        : new Date();

    return currentDate.toDateString() !== previousDate.toDateString();
};

// Date Separator Component
const DateSeparator = React.memo(({ date }: { date: Date }) => (
    <div className="flex items-center justify-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs font-semibold text-gray-500 px-2 bg-gray-50 rounded-full whitespace-nowrap">
            {getDateSeparatorText(date)}
        </span>
        <div className="flex-1 h-px bg-gray-300"></div>
    </div>
));

const MessageItem = React.memo(({ msg, isMe, searchQuery, searchResultId, isSearchOpen, onPin, currentUserRole, selectedUserId, messageRef }: {
    msg: ChatMessage,
    isMe: boolean,
    searchQuery: string,
    searchResultId: string | undefined,
    isSearchOpen: boolean,
    onPin: (id: string, status: boolean) => void,
    currentUserRole: string,
    selectedUserId: string,
    messageRef: (el: HTMLDivElement | null) => void
}) => {
    let contentNode: React.ReactNode = msg.content;
    if (searchQuery.trim()) {
        const parts = msg.content.split(new RegExp(`(${searchQuery})`, 'gi'));
        contentNode = parts.map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase()
                ? <span key={index} className="bg-yellow-200 text-black font-bold rounded px-0.5">{part}</span>
                : part
        );
    }

    const messageDate = msg.timestamp?.seconds
        ? new Date(msg.timestamp.seconds * 1000)
        : new Date();
    const timeString = messageDate.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div
            ref={messageRef}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative transition-colors duration-500`}
        >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 px-4 shadow-sm break-words relative ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'} ${searchResultId === msg.id && isSearchOpen ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''}`}>
                {currentUserRole === 'director' && (
                    <button
                        onClick={() => onPin(msg.id, !!msg.isPinned)}
                        className={`absolute -top-2 ${isMe ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-500 rounded-full p-1 shadow-md border hover:text-yellow-500 z-10`}
                        title={msg.isPinned ? "إلغاء التثبيت" : "تثبيت الرسالة"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${msg.isPinned ? 'text-yellow-500 fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                )}

                {selectedUserId.startsWith('group-') && !isMe && (
                    <p className="text-[10px] text-gray-500 mb-1 font-bold">{msg.senderName}</p>
                )}

                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{contentNode}</p>

                <div className="flex justify-between items-center mt-1 gap-2">
                    {msg.isPinned && <span className="text-[10px] text-yellow-300 bg-black/20 px-1 rounded">📌 مثبتة</span>}
                    <span className={`text-[10px] block text-right ml-auto ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                        {timeString}
                        {isMe && (msg.read ? <span className="mr-1">✓✓</span> : <span className="mr-1">✓</span>)}
                    </span>
                </div>
            </div>
        </div>
    );
});

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, teachers, groups, students, parents, supervisors, onBack, initialSelectedUserId }) => {
    // ... (state remains same)
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [cachedMessages, setCachedMessages] = useState<{ [key: string]: ChatMessage[] }>({});
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
    const [userStats, setUserStats] = useState<{ [key: string]: { unreadCount: number; lastTimestamp: any; lastMessage: string } }>({});
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ... (Search and Pin state remains same)
    // In-Chat Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);

    const lastMessageCountRef = useRef(0);
    const isAtBottomRef = useRef(true);

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // Track scroll position to decide if we should auto-scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
        if (isAtBottomRef) {
            isAtBottomRef.current = isAtBottom;
        }
    };

    useEffect(() => {
        if (isSearchOpen || messages.length === 0) return;

        // More aggressive scroll as requested: pull down on any message change
        const isFirstLoad = lastMessageCountRef.current === 0;

        const timer = setTimeout(() => {
            scrollToBottom(isFirstLoad ? "auto" : "smooth");
            lastMessageCountRef.current = messages.length;
        }, 100);

        return () => clearTimeout(timer);
    }, [messages, isSearchOpen]);

    // 1. Setup Data: Map Teachers + Director + Supervisors + PARENTS to ChatUser list 
    // 1. Memoized Base Users construction
    const baseUsers = useMemo(() => {
        let users: ChatUser[] = [];
        const getParentDesc = (p: Parent) => {
            if (!students) return 'ولي أمر';
            const childNames = students
                .filter(s => p.studentIds.includes(s.id))
                .map(s => s.name.split(' ')[0])
                .join(' و ');
            return childNames ? `ولي أمر ${childNames}` : 'ولي أمر';
        };

        if (currentUser.role === 'director') {
            const groupUsers: ChatUser[] = SECTIONS.map(section => ({
                id: section.id, name: section.name, role: 'teacher', isOnline: true, unreadCount: 0
            }));
            const teacherUsers = teachers.map(t => ({
                id: t.id, name: t.name, role: 'teacher' as const, isOnline: false, unreadCount: 0
            }));
            let parentUsers: ChatUser[] = [];
            if (parents) {
                parentUsers = parents.map(p => ({
                    id: p.id, name: p.name, role: 'parent' as const, isOnline: false, unreadCount: 0, description: getParentDesc(p)
                }));
            }
            users = [...groupUsers, ...teacherUsers, ...parentUsers];
        } else if (currentUser.role === 'teacher') {
            users.push({ id: 'director', name: 'الإدارة', role: 'director', isOnline: true, unreadCount: 0 });
            users.push({ id: 'group-all', name: '📢 جميع المدرسين', role: 'teacher', isOnline: true, unreadCount: 0 });
            const myGroups = groups.filter(g => g.teacherId === currentUser.uid);
            SECTIONS.forEach(section => {
                if (section.keyword === 'all') return;
                if (myGroups.some(g => g.name.includes(section.keyword))) {
                    users.push({ id: section.id, name: section.name, role: 'teacher', isOnline: true, unreadCount: 0 });
                }
            });
            if (parents && students) {
                const myStudentIds = students.filter(s => myGroups.some(g => g.id === s.groupId)).map(s => s.id);
                parents.filter(p => p.studentIds.some(sid => myStudentIds.includes(sid))).forEach(p => {
                    users.push({ id: p.id, name: p.name, role: 'parent', isOnline: false, unreadCount: 0, description: getParentDesc(p) });
                });
            }
        } else if (currentUser.role === 'parent') {
            users.push({ id: 'director', name: 'الإدارة', role: 'director', isOnline: true, unreadCount: 0, description: 'إدارة المركز' });
            if (supervisors) {
                supervisors.forEach(s => {
                    if (s.status !== 'active') return;
                    const supervisedChildNames = students?.filter(student => {
                        const studentGroup = groups.find(g => g.id === student.groupId);
                        return studentGroup && s.section?.some(sec => sec === 'all' || studentGroup.name.includes(sec));
                    }).map(student => student.name.split(' ')[0]).filter((val, index, self) => self.indexOf(val) === index).join(' و ');
                    users.push({ id: s.id, name: s.name, role: 'supervisor', isOnline: false, unreadCount: 0, description: supervisedChildNames ? `مشرف ${supervisedChildNames}` : 'مشرف' });
                });
            }
            if (students && students.length > 0) {
                const myChildrenGroups = groups.filter(g => students.some(s => s.groupId === g.id));
                const myTeachers = teachers.filter(t => myChildrenGroups.some(g => g.teacherId === t.id));
                myTeachers.forEach(teacher => {
                    const taughtGroups = myChildrenGroups.filter(g => g.teacherId === teacher.id);
                    const childNames = students.filter(s => taughtGroups.some(g => g.id === s.groupId)).map(s => s.name.split(' ')[0]).join(' و ');
                    users.push({ id: teacher.id, name: teacher.name, role: 'teacher', isOnline: false, unreadCount: 0, description: childNames ? `مدرس ابنك ${childNames}` : 'مدرس ابنك' });
                });
            }
        } else if (currentUser.role === 'supervisor') {
            users.push({ id: 'director', name: 'الإدارة', role: 'director', isOnline: true, unreadCount: 0, description: 'إدارة المركز' });
            teachers.forEach(t => {
                users.push({ id: t.id, name: t.name, role: 'teacher', isOnline: false, unreadCount: 0 });
            });
            SECTIONS.forEach(section => {
                users.push({ id: section.id, name: section.name, role: 'teacher', isOnline: true, unreadCount: 0 });
            });
        }
        return users;
    }, [currentUser.role, teachers, currentUser.uid, groups, students, parents, supervisors]);

    // 2. Presence Update
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'presence'), (snapshot) => {
            const presenceMap = new Map();
            snapshot.forEach(doc => presenceMap.set(doc.id, doc.data()));

            setChatUsers(prevUsers => {
                const uniqueUsers = new Map<string, ChatUser>();
                // Mix in base users and discovered users from state
                baseUsers.forEach(u => uniqueUsers.set(u.id, u));
                prevUsers.forEach(u => {
                    if (!uniqueUsers.has(u.id)) {
                        uniqueUsers.set(u.id, u);
                    }
                });

                const updated = Array.from(uniqueUsers.values()).map(user => {
                    if (user.id.startsWith('group-') || user.id === 'director') return user;
                    const presence = presenceMap.get(user.id);
                    const isOnline = presence ? (Date.now() - presence.lastSeen?.toMillis()) < 5 * 60 * 1000 : false;
                    const stats = userStats[user.id];
                    return {
                        ...user,
                        isOnline,
                        lastSeen: presence?.lastSeen,
                        unreadCount: stats?.unreadCount || 0,
                        lastMessageTimestamp: stats?.lastTimestamp,
                        lastMessageContent: stats?.lastMessage
                    };
                });

                return updated.sort((a, b) => {
                    const timeA = a.lastMessageTimestamp?.toMillis ? a.lastMessageTimestamp.toMillis() : 0;
                    const timeB = b.lastMessageTimestamp?.toMillis ? b.lastMessageTimestamp.toMillis() : 0;
                    if (timeA !== timeB) return timeB - timeA;
                    const getRank = (u: ChatUser) => {
                        if (u.id === 'director') return 0;
                        if (u.role === 'supervisor') return 1;
                        if (u.id.startsWith('group-')) return 2;
                        if (u.role === 'teacher') return 3;
                        if (u.role === 'parent') return 4;
                        return 5;
                    };
                    const rankA = getRank(a);
                    const rankB = getRank(b);
                    if (rankA !== rankB) return rankA - rankB;
                    return a.name.localeCompare(b.name, 'ar');
                });
            });
        });

        return () => unsubscribe();
    }, [baseUsers, userStats]); // Simplified dependencies

    // Auto-select initial user if provided
    useEffect(() => {
        if (initialSelectedUserId && chatUsers.length > 0 && !selectedUser) {
            const userToSelect = chatUsers.find(u => u.id === initialSelectedUserId);
            if (userToSelect) {
                setSelectedUser(userToSelect);
            }
        }
    }, [initialSelectedUserId, chatUsers, selectedUser]);


    // 3. Global message listener for unread counts and sorting
    useEffect(() => {
        const myId = currentUser.role === 'director' ? 'director' : currentUser.uid;

        // Listen both for messages sent TO me (for unreads and sorting) and FROM me (for sorting)
        // Optimized: We limit these to the last 100 messages to populate recent chats list efficiently
        const qTo = query(
            collection(db, 'messages'),
            where('receiverId', '==', myId)
        );

        const qFrom = query(
            collection(db, 'messages'),
            where('senderId', '==', myId)
        );

        // Separate query strictly for unread counts (no limit, but should be small number of docs)
        const qUnreads = query(
            collection(db, 'messages'),
            where('receiverId', '==', myId),
            where('read', '==', false)
        );

        const updateStats = (snapshot: any, isOutgoing: boolean) => {
            setUserStats(prev => {
                const newStats = { ...prev };
                snapshot.docs.forEach((doc: any) => {
                    const msg = doc.data() as ChatMessage;
                    const partnerId = isOutgoing ? msg.receiverId : msg.senderId;

                    if (partnerId.startsWith('group-')) return;

                    if (!newStats[partnerId]) {
                        newStats[partnerId] = { unreadCount: 0, lastTimestamp: null, lastMessage: '' };
                    }

                    const msgTime = msg.timestamp?.toMillis ? msg.timestamp.toMillis() : 0;
                    const currentLastTime = newStats[partnerId].lastTimestamp?.toMillis ? newStats[partnerId].lastTimestamp.toMillis() : 0;

                    if (msgTime > currentLastTime) {
                        newStats[partnerId].lastTimestamp = msg.timestamp;
                        newStats[partnerId].lastMessage = msg.content;
                    }
                });
                return newStats;
            });
        };

        const updateUnreads = (snapshot: any) => {
            const unreadMap: { [key: string]: number } = {};
            snapshot.docs.forEach((doc: any) => {
                const msg = doc.data() as ChatMessage;
                unreadMap[msg.senderId] = (unreadMap[msg.senderId] || 0) + 1;
            });

            setUserStats(prev => {
                const newStats = { ...prev };
                Object.keys(newStats).forEach(pid => {
                    newStats[pid].unreadCount = unreadMap[pid] || 0;
                });
                // Also ensure we have stats for senders of unread messages even if not in recent 100
                Object.keys(unreadMap).forEach(sid => {
                    if (!newStats[sid]) {
                        newStats[sid] = { unreadCount: unreadMap[sid], lastTimestamp: null, lastMessage: '' };
                    }
                    newStats[sid].unreadCount = unreadMap[sid];
                });
                return newStats;
            });
        };

        const unsubTo = onSnapshot(qTo, (snapshot) => updateStats(snapshot, false));
        const unsubFrom = onSnapshot(qFrom, (snapshot) => updateStats(snapshot, true));
        const unsubUnreads = onSnapshot(qUnreads, updateUnreads);

        return () => {
            unsubTo();
            unsubFrom();
            unsubUnreads();
        };
    }, [currentUser.uid, currentUser.role]);

    // 4. Presence Heartbeat
    useEffect(() => {
        const updatePresence = async () => {
            const myId = currentUser.role === 'director' ? 'director' : currentUser.uid;
            const userRef = doc(db, 'presence', myId);
            await setDoc(userRef, {
                lastSeen: serverTimestamp(),
                name: currentUser.name,
                role: currentUser.role
            }, { merge: true });
        };

        updatePresence();
        const interval = setInterval(updatePresence, 60000);
        return () => clearInterval(interval);
    }, [currentUser]);

    // 3. Listen for Messages (Optimized with Caching)
    useEffect(() => {
        if (!selectedUser) return;
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);

        const myId = currentUser.role === 'director' ? 'director' : currentUser.uid;
        const partnerId = selectedUser.id;
        const isGroup = partnerId.startsWith('group-');

        // Show cached messages immediately for instant feedback
        if (cachedMessages[partnerId]) {
            setMessages(cachedMessages[partnerId]);
        } else {
            setMessages([]);
        }

        const unsubs: (() => void)[] = [];

        if (isGroup) {
            const q = query(
                collection(db, 'messages'),
                where('receiverId', '==', partnerId),
                limit(100)
            );

            const unsub = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
                setMessages(prev => {
                    const temps = prev.filter(m => m.id.startsWith('temp-'));
                    const final = [...msgs, ...temps.filter(t => !msgs.some(m => m.content === t.content))].sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
                    setCachedMessages(c => ({ ...c, [partnerId]: final }));
                    return final;
                });
            }, (err) => console.error("❌ Group snapshot error:", err));
            unsubs.push(unsub);
        } else {
            // Optimized 1-on-1: Shared state to prevent flickering
            const q1 = query(
                collection(db, 'messages'),
                where('senderId', '==', myId),
                where('receiverId', '==', partnerId),
                limit(50)
            );

            const q2 = query(
                collection(db, 'messages'),
                where('senderId', '==', partnerId),
                where('receiverId', '==', myId),
                limit(50)
            );

            let sentMsgs: ChatMessage[] = [];
            let receivedMsgs: ChatMessage[] = [];

            const updateCombinedMessages = () => {
                setMessages(prev => {
                    const combined = [...sentMsgs, ...receivedMsgs];
                    const temps = prev.filter(m => m.id.startsWith('temp-'));
                    const final = [...combined, ...temps.filter(t => !combined.some(m => m.content === t.content && m.senderId === t.senderId))]
                        .sort((a, b) => {
                            const tA = a.timestamp?.seconds || (a.id.startsWith('temp-') ? Date.now() / 1000 : 0);
                            const tB = b.timestamp?.seconds || (b.id.startsWith('temp-') ? Date.now() / 1000 : 0);
                            return tA - tB;
                        });
                    setCachedMessages(c => ({ ...c, [partnerId]: final }));
                    return final;
                });
            };

            const unsub1 = onSnapshot(q1, (snapshot) => {
                sentMsgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
                updateCombinedMessages();
            }, (err) => console.error("❌ unsub1 error:", err));

            const unsub2 = onSnapshot(q2, (snapshot) => {
                receivedMsgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));

                // Mark received messages as read efficiently
                receivedMsgs.forEach(msg => {
                    if (!msg.read) {
                        updateDoc(doc(db, 'messages', msg.id), { read: true });
                    }
                });

                updateCombinedMessages();
            });

            unsubs.push(unsub1, unsub2);
        }

        return () => {
            unsubs.forEach(u => u());
        };
    }, [selectedUser?.id, currentUser.uid]); // Optimized dependency array

    // --- SEARCH FUNCTIONALITY ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setCurrentSearchIndex(0);
            return;
        }

        // Find all messages containing the query (case insensitive)
        const results = messages
            .filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(msg => msg.id);
        // We keep the order same as messages array (oldest to newest)

        setSearchResults(results);
        // Default to last match (newest)
        if (results.length > 0) {
            setCurrentSearchIndex(results.length - 1);
        } else {
            setCurrentSearchIndex(0);
        }
    }, [searchQuery, messages]);

    const handleSearchNav = (direction: 'next' | 'prev') => {
        if (searchResults.length === 0) return;

        let newIndex = direction === 'next' ? currentSearchIndex + 1 : currentSearchIndex - 1;

        // Loop functionality
        if (newIndex >= searchResults.length) newIndex = 0;
        if (newIndex < 0) newIndex = searchResults.length - 1;

        setCurrentSearchIndex(newIndex);

        const targetId = searchResults[newIndex];
        const el = messageRefs.current[targetId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-yellow-100'); // Use Tailwind class for highlight logic if component re-renders
        }
    };

    // --- PINNED MESSAGES LOGIC ---
    // Get ALL pinned messages, sorted Newest first
    const pinnedMessages = useMemo(() => {
        return messages.filter(m => m.isPinned).sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
    }, [messages]);

    useEffect(() => {
        // Reset pinned index if messages change significantly or current index invalid
        if (currentPinnedIndex >= pinnedMessages.length) {
            setCurrentPinnedIndex(0);
        }
    }, [pinnedMessages.length]);

    const handlePinnedNav = (direction: 'next' | 'prev') => {
        if (pinnedMessages.length <= 1) return;
        let newIndex = direction === 'next' ? currentPinnedIndex + 1 : currentPinnedIndex - 1;

        if (newIndex >= pinnedMessages.length) newIndex = 0;
        if (newIndex < 0) newIndex = pinnedMessages.length - 1;

        setCurrentPinnedIndex(newIndex);
    };

    const jumpToPinnedMessage = (msgId: string) => {
        const el = messageRefs.current[msgId];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a visual flash effect (using direct style for guaranteed flash)
            el.style.transition = 'background-color 0.5s';
            el.style.backgroundColor = '#fef08a'; // yellow-200
            setTimeout(() => {
                el.style.backgroundColor = '';
            }, 1000);
        }
    };

    // Helper to identify parent context
    const getParentDescription = (parentId: string) => {
        if (!students) return '';
        const childNames = students
            // Parents might be linked by ID or Phone. The simplest link we have for current user is explicit context.
            // But here we need to find children for *this* parentId (which is likely currentUser.uid or phone).
            // For now, let's look for match in student.studentIds (if available in Student interface?) or just assume current User context if it's the sender.
            .filter(s => {
                // This is tricky without a full parent map. 
                // For currentUser (Parent), we know the students.
                // For incoming messages, we rely on the senderName being descriptive.
                // So this helper is mainly for *sending* as a parent.
                return true; // We'll filter in the usage
            });

        // Actually, better to rely on what passed in App.tsx:
        // If currentUser is parent, 'students' prop contains *their* students.
        if (currentUser.role === 'parent' && parentId === currentUser.uid) {
            return students.map(s => s.name.split(' ')[0]).join(' و ');
        }
        return '';
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const myId = currentUser.role === 'director' ? 'director' : currentUser.uid;
        const messageContent = newMessage.trim();

        // Enrich Sender Name for Parents
        let senderDisplayName = currentUser.name;
        if (currentUser.role === 'parent') {
            const children = getParentDescription(currentUser.uid);
            if (children) {
                senderDisplayName = `${currentUser.name} (ولي أمر ${children})`;
            }
        }

        // Optimistic UI Update
        const tempId = 'temp-' + Date.now();
        const tempMsg: ChatMessage = {
            id: tempId,
            senderId: myId,
            senderName: senderDisplayName,
            receiverId: selectedUser.id,
            content: messageContent,
            timestamp: { seconds: Date.now() / 1000, toMillis: () => Date.now() },
            read: false,
            isPinned: false
        };

        setMessages(prev => [...prev, tempMsg].sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)));
        setNewMessage('');

        try {
            const docRef = await addDoc(collection(db, 'messages'), {
                senderId: myId,
                senderName: senderDisplayName,
                receiverId: selectedUser.id,
                content: messageContent,
                timestamp: serverTimestamp(),
                read: false,
                isPinned: false
            });

            // Speed up: replace temp with real one in cache immediately if timestamp is ready
            // (Actually Firestore will update on next snapshot, but let's keep it simple)
        } catch (error) {
            console.error("Error sending message", error);
            alert("فشل إرسال الرسالة");
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    // ... (Inside useEffect for messages) ...
    // We need to allow Director/Supervisor to see parents in the list if they message them.
    useEffect(() => {
        if (currentUser.role === 'parent') return; // Parents have fixed list

        // Listen to ALL incoming messages for Director/Supervisor to discover new contacts (Parents)
        const q = query(
            collection(db, 'messages'),
            where('receiverId', '==', currentUser.role === 'director' ? 'director' : currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const msg = change.doc.data() as ChatMessage;
                    setChatUsers(prevUsers => {
                        // If sender is already in list, just update unread/last msg if we had that logic (we don't tracking last msg text yet here)
                        // If NOT in list, add them.
                        const exists = prevUsers.some(u => u.id === msg.senderId);
                        if (!exists && msg.senderId !== 'director' && !msg.senderId.startsWith('group-')) {
                            // It's likely a parent
                            return [...prevUsers, {
                                id: msg.senderId,
                                name: msg.senderName, // This will now contain "(ولي أمر ...)"
                                role: 'parent',
                                isOnline: false, // We don't track parent presence yet, assume offline
                                unreadCount: 1,
                                description: 'تواصل جديد'
                            }];
                        }
                        return prevUsers;
                    });
                }
            });
        });

        return () => unsubscribe();
    }, [currentUser.role, currentUser.uid]); // Run once for staff

    const handlePinMessage = async (messageId: string, currentPinStatus?: boolean) => {
        // Only Director can pin? Or maybe anyone in the chat? Let's say Director.
        if (currentUser.role !== 'director') return;

        try {
            if (currentPinStatus) {
                // Unpin
                await updateDoc(doc(db, 'messages', messageId), { isPinned: false });
            } else {
                // Pin (Unpin others? Usually fine to have multiple, but Sticky usually one. Let's assume one pinned for now or filter for first)
                // If we want only ONE pinned message per chat, we need to unpin others first? 
                // Let's just allow marking as pinned, and in UI we show the *last* pinned message or *all* pinned messages.
                // Re-reading user request: "Tatbeet al-risala" (Pin the message).
                await updateDoc(doc(db, 'messages', messageId), { isPinned: true });
            }
        } catch (error) {
            console.error("Error pinning message", error);
        }
    };

    // Filter users list based on sidebar search
    const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'staff' | 'parents'>('all');

    const filteredChatUsers = chatUsers.filter(u => {
        const matchesSearch = u.name.includes(userSearchTerm);
        if (!matchesSearch) return false;

        if (activeTab === 'all') return true;
        if (activeTab === 'groups') return u.id.startsWith('group-');
        if (activeTab === 'parents') return u.role === 'parent';
        if (activeTab === 'staff') return !u.id.startsWith('group-') && u.role !== 'parent';

        return true;
    });

    const currentPinnedMessage = pinnedMessages[currentPinnedIndex];

    return (
        <div className="flex flex-col md:flex-row h-full bg-gray-100 md:rounded-xl overflow-hidden shadow-xl border border-gray-200">
            {/* Sidebar (Users List) */}
            <div className={`w-full md:w-1/3 bg-white border-l border-gray-200 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex h-full'}`}>
                <div className="p-4 border-b bg-gray-50 flex flex-col gap-3 shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-gray-700 text-lg">المحادثات</h2>
                        <button onClick={onBack} className="text-gray-500 hover:text-red-500 text-sm px-3 py-1 rounded-full hover:bg-red-50 transition-colors">
                            إغلاق
                        </button>
                    </div>
                    {/* User Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="بحث عن مدرس أو مجموعة..."
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 pl-8"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Categories Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar md:flex-wrap">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setActiveTab('groups')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === 'groups' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            المجموعات
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === 'staff' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            المدرسين والإدارة
                        </button>
                        {/* Only show Parents tab if there are any parents or if role allows */}
                        {(currentUser.role === 'director' || currentUser.role === 'teacher') && (
                            <button
                                onClick={() => setActiveTab('parents')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeTab === 'parents' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                ولاة الأمر
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredChatUsers.map(user => (
                        <div
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4 ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                        >
                            <div className="relative shrink-0">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border border-gray-100 ${user.id.startsWith('group-') ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-600'}`}>
                                    {user.id.startsWith('group-') ? '📣' : user.name.charAt(0)}
                                </div>
                                {user.isOnline && !user.id.startsWith('group-') && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-base truncate">{user.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                    {user.lastMessageContent ? (
                                        <span className="truncate">{user.lastMessageContent}</span>
                                    ) : user.description ? (
                                        <span className="text-teal-600 font-medium">{user.description}</span>
                                    ) : (
                                        user.id.startsWith('group-') ? <span className="text-amber-600">مجموعة عامة</span> : (
                                            <span className={user.isOnline ? 'text-green-600' : 'text-gray-400'}>
                                                {user.isOnline ? 'نشط الآن' : formatLastSeen(user.lastSeen)}
                                            </span>
                                        )
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                {user.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm animate-bounce">
                                        {user.unreadCount}
                                    </span>
                                )}
                                <svg className="w-4 h-4 text-gray-300 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                    {filteredChatUsers.length === 0 && (
                        <div className="text-center p-4 text-gray-400 text-sm">لا توجد نتائج</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-gray-50 h-full ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        <div className="p-3 md:p-4 bg-white border-b shadow-sm flex items-center gap-3 shrink-0 z-10 relative">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${selectedUser.id.startsWith('group-') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                {selectedUser.id.startsWith('group-') ? '📣' : selectedUser.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">{selectedUser.name}</h3>
                                {selectedUser.id.startsWith('group-') ? (
                                    <span className="text-xs text-amber-600 font-semibold">مجموعة بث للقسم</span>
                                ) : (
                                    <span className={`text-xs flex items-center gap-1 ${selectedUser.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                        {selectedUser.isOnline ? (
                                            <>
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                                <span>متصل</span>
                                            </>
                                        ) : (
                                            <span>آخر ظهور {formatLastSeen(selectedUser.lastSeen)}</span>
                                        )}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                {/* SEARCH TOGGLE BUTTON */}
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="بحث في المحادثة"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>

                                {/* CLOSE MODAL BUTTON */}
                                <button
                                    onClick={onBack}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="إغلاق"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                        </div>

                        {/* SEARCH BAR (Conditional) */}
                        {isSearchOpen && (
                            <div className="bg-white border-b p-2 flex items-center gap-2 animate-in slide-in-from-top-2">
                                <div className="relative flex-1">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="ابحث عن رسالة..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                                    />
                                    {searchResults.length > 0 && (
                                        <div className="absolute left-3 top-2 text-xs text-gray-400">
                                            {currentSearchIndex + 1} / {searchResults.length}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => handleSearchNav('prev')} disabled={searchResults.length === 0} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30 self-stretch px-2"><span className="text-lg">↑</span></button>
                                <button onClick={() => handleSearchNav('next')} disabled={searchResults.length === 0} className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30 self-stretch px-2"><span className="text-lg">↓</span></button>
                                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 text-red-500 hover:bg-red-50 rounded">✕</button>
                            </div>
                        )}

                        {/* Pinned Message Banner - WITH NAVIGATION */}
                        {currentPinnedMessage && !isSearchOpen && (
                            <div className="bg-yellow-50 border-b border-yellow-200 p-2 px-4 flex justify-between items-center shadow-sm z-0">
                                <div
                                    className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1"
                                    onClick={() => jumpToPinnedMessage(currentPinnedMessage.id)}
                                >
                                    <span className="text-yellow-600 shrink-0">📌</span>
                                    <div className="flex flex-col min-w-0">
                                        <div className="text-xs text-yellow-700 font-bold mb-0.5 flex items-center gap-2">
                                            <span>رسالة مثبتة {pinnedMessages.length > 1 && `(${currentPinnedIndex + 1}/${pinnedMessages.length})`}</span>
                                            <span className="font-normal text-gray-500 text-[10px]">- {currentPinnedMessage.senderName}</span>
                                        </div>
                                        <div className="text-sm text-gray-800 truncate">
                                            {currentPinnedMessage.content}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {pinnedMessages.length > 1 && (
                                        <div className="flex items-center bg-yellow-100 rounded-lg mr-2">
                                            <button onClick={() => handlePinnedNav('next')} className="p-1 hover:bg-yellow-200 text-yellow-700 rounded-r-lg px-2 text-xs"> التالي &lt; </button>
                                            <div className="w-px h-4 bg-yellow-300"></div>
                                            <button onClick={() => handlePinnedNav('prev')} className="p-1 hover:bg-yellow-200 text-yellow-700 rounded-l-lg px-2 text-xs"> &gt; السابق </button>
                                        </div>
                                    )}

                                    {currentUser.role === 'director' && (
                                        <button onClick={() => handlePinMessage(currentPinnedMessage.id, true)} className="text-gray-400 hover:text-red-500 p-1" title="إلغاء التثبيت">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 bg-opacity-50"
                            style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                        >
                            {messages.map((msg, index) => {
                                const previousMsg = index > 0 ? messages[index - 1] : undefined;
                                const showDateSeparator = isDateChanged(msg, previousMsg);
                                const messageDate = msg.timestamp?.seconds
                                    ? new Date(msg.timestamp.seconds * 1000)
                                    : new Date();

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDateSeparator && <DateSeparator date={messageDate} />}
                                        <MessageItem
                                            msg={msg}
                                            isMe={msg.senderId === (currentUser.role === 'director' ? 'director' : currentUser.uid)}
                                            searchQuery={searchQuery}
                                            searchResultId={searchResults[currentSearchIndex]}
                                            isSearchOpen={isSearchOpen}
                                            onPin={handlePinMessage}
                                            currentUserRole={currentUser.role}
                                            selectedUserId={selectedUser.id}
                                            messageRef={el => messageRefs.current[msg.id] = el}
                                        />
                                    </React.Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} className="h-8" />
                        </div>

                        <div className="p-3 md:p-4 bg-white border-t shrink-0">
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={selectedUser.id.startsWith('group-') ? `إرسال إلى ${selectedUser.name}...` : "اكتب رسالتك..."}
                                    className="flex-1 border bg-gray-50 border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 shadow-md"
                                >
                                    <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">مرحباً بك في المحادثات</h3>
                        <p className="text-gray-500 max-w-xs">اختر زميلاً أو مجموعة من القائمة لبدء التواصل.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ChatPage);
