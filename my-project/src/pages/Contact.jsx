import React, { useState } from "react";
import { Mail, MessageCircle, Globe, Send } from "lucide-react";

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("Message sent! (Demo)");
        setTimeout(() => setStatus(""), 3000);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 animate-[slideUp_0.6s_ease-out]">
                {/* Info Side */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-tight">
                            Let's stay <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">connected</span>
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium max-w-sm">
                            Have questions, feedback, or just want to say hi? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <ContactItem icon={<Mail className="w-5 h-5" />} label="Email" value="hello@dobby.ai" />
                        <ContactItem icon={<MessageCircle className="w-5 h-5" />} label="Discord" value="dobby_community" />
                        <ContactItem icon={<Globe className="w-5 h-5" />} label="Website" value="www.dobby.ai" />
                    </div>
                </div>

                {/* Form Side */}
                <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-5 shadow-2xl backdrop-blur-3xl">
                    <div className="space-y-4">
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Your Name</label>
                            <input
                                type="text"
                                placeholder="Dobby's Friend"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 outline-none focus:bg-white/10 focus:border-blue-500/30 transition-all font-medium text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="friend@example.com"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 outline-none focus:bg-white/10 focus:border-blue-500/30 transition-all font-medium text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Message</label>
                            <textarea
                                placeholder="Whatcha thinkin' about?"
                                rows="4"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 outline-none focus:bg-white/10 focus:border-blue-500/30 transition-all font-medium text-sm resize-none"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group"
                    >
                        <span>Send Your Message</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    {status && <p className="text-center text-blue-400 text-xs font-bold animate-pulse">{status}</p>}
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </div>
    );
};

const ContactItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
            <p className="text-zinc-300 font-bold tracking-tight">{value}</p>
        </div>
    </div>
);

export default Contact;
