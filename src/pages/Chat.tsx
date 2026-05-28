import { useState, useEffect, useRef, FormEvent } from 'react';
import { Send, Search, User, Phone, Video, MoreVertical, Paperclip, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseUtils';

export default function Chat() {
  const [activeChat, setActiveChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all users to chat with (excluding self)
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const allUsers = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== auth.currentUser?.uid);
      setUsers(allUsers);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!activeChat || !auth.currentUser) return;

    // Room ID logic: sorted UID combined string
    const roomId = [auth.currentUser.uid, activeChat.id].sort().join('_');
    
    const q = query(
      collection(db, 'messages'),
      where('channelId', '==', roomId),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'messages');
    });

    return unsub;
  }, [activeChat]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !auth.currentUser) return;

    const roomId = [auth.currentUser.uid, activeChat.id].sort().join('_');
    const msgData = {
      channelId: roomId,
      senderId: auth.currentUser.uid,
      text: message.trim(),
      createdAt: serverTimestamp()
    };

    setMessage('');
    try {
      await addDoc(collection(db, 'messages'), msgData);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Check Firestore rules.");
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center dashboard-card">
        <Loader2 className="animate-spin text-yellow" size={32} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[600px] flex dashboard-card overflow-hidden">
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-navy mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none w-full" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {users.map(u => (
            <button 
              key={u.id}
              onClick={() => setActiveChat(u)}
              className={cn(
                "w-full p-4 flex items-center gap-3 transition-all hover:bg-slate-50 border-b border-slate-50 text-left",
                activeChat?.id === u.id ? "bg-slate-50 border-r-4 border-r-yellow" : ""
              )}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt={u.name} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-navy">{u.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={activeChat.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeChat.id}`} alt={activeChat.name} />
                </div>
                <div>
                  <h3 className="font-bold text-navy leading-none mb-1">{activeChat.name}</h3>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Chat</p>
                </div>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/graphy-very-light.png')]"
            >
              {messages.map((msg, i) => {
                const isMine = msg.senderId === auth.currentUser?.uid;
                return (
                  <div key={msg.id} className={cn("flex gap-3 max-w-lg", isMine ? "flex-row-reverse ml-auto" : "")}>
                    <div className={cn(
                      "p-4 rounded-2xl shadow-sm text-sm",
                      isMine ? "bg-navy text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    )}>
                      <p>{msg.text}</p>
                      <p className={cn("text-[9px] mt-2", isMine ? "text-slate-400" : "text-slate-400")}>
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                      </p>
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && (
                <div className="text-center py-20 text-slate-300">
                  <p className="text-xs font-bold uppercase tracking-widest">Start a new conversation</p>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="p-6 border-t border-slate-100">
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                <button type="button" className="p-2 text-slate-400 hover:text-navy transition-colors"><Paperclip size={20} /></button>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  className="flex-1 bg-transparent border-none text-sm focus:outline-none p-2" 
                />
                <button type="submit" disabled={!message.trim()} className="bg-navy text-white p-3 rounded-xl hover:bg-navy-light transition-all active:scale-95 disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-bold text-navy">No chat selected</h3>
            <p className="text-slate-500 max-w-sm">Select a colleague or partner from the sidebar to start real-time messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
