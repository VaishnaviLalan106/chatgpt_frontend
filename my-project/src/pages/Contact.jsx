import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Globe, Send, CheckCircle2 } from "lucide-react";

const Contact = () => {
    const [status, setStatus] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("Message sent! (Demo)");
        setTimeout(() => setStatus(""), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto custom-scrollbar">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
            >
                {/* Info Side */}
                <motion.div variants={itemVariants} className="space-y-7 md:space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight" style={{ color: 'var(--text-heading)' }}>
                            Let's stay <br />
                            <span style={{
                                backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>connected</span>
                        </h1>
                        <p className="text-base md:text-lg font-medium max-w-sm" style={{ color: 'var(--text-muted)' }}>
                            Have questions, feedback, or just want to say hi? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <ContactItem icon={<Mail className="w-5 h-5" />} label="Email" value="hello@dobby.ai" />
                        <ContactItem icon={<MessageCircle className="w-5 h-5" />} label="Discord" value="dobby_community" />
                        <ContactItem icon={<Globe className="w-5 h-5" />} label="Website" value="www.dobby.ai" />
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSubmit}
                    className="p-6 md:p-8 space-y-5 rounded-[2rem] shadow-2xl"
                    style={{
                        background: 'var(--bg-surface)',
                        backdropFilter: 'blur(40px)',
                        border: '1px solid var(--border-medium)',
                    }}
                >
                    <div className="space-y-4">
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-dim)' }}>Your Name</label>
                            <input
                                type="text"
                                placeholder="Dobby's Friend"
                                className="w-full rounded-2xl px-5 py-3.5 placeholder-slate-600 outline-none transition-all font-medium text-sm"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                                onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; e.target.style.borderColor = 'var(--border-input-focus)'; }}
                                onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; e.target.style.borderColor = 'var(--border-input)'; }}
                                required
                            />
                        </div>
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-dim)' }}>Email Address</label>
                            <input
                                type="email"
                                placeholder="friend@example.com"
                                className="w-full rounded-2xl px-5 py-3.5 placeholder-slate-600 outline-none transition-all font-medium text-sm"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                                onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; e.target.style.borderColor = 'var(--border-input-focus)'; }}
                                onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; e.target.style.borderColor = 'var(--border-input)'; }}
                                required
                            />
                        </div>
                        <div className="space-y-1.5 px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest ml-1" style={{ color: 'var(--text-dim)' }}>Message</label>
                            <textarea
                                placeholder="Whatcha thinkin' about?"
                                rows="4"
                                className="w-full rounded-2xl px-5 py-4 placeholder-slate-600 outline-none transition-all font-medium text-sm resize-none"
                                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                                onFocus={(e) => { e.target.style.background = 'var(--bg-input-focus)'; e.target.style.borderColor = 'var(--border-input-focus)'; }}
                                onBlur={(e) => { e.target.style.background = 'var(--bg-input)'; e.target.style.borderColor = 'var(--border-input)'; }}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 rounded-2xl text-white font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(59,130,246,0.25)' }}
                    >
                        <span>Send Your Message</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.button>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold"
                        >
                            <CheckCircle2 className="w-4 h-4" /> {status}
                        </motion.div>
                    )}
                </motion.form>
            </motion.div>
        </div>
    );
};

const ContactItem = ({ icon, label, value }) => (
    <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center gap-4 group cursor-default"
    >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors"
            style={{ background: 'var(--bg-card)' }}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-dim)' }}>{label}</p>
            <p className="font-semibold tracking-tight" style={{ color: 'var(--text-secondary)' }}>{value}</p>
        </div>
    </motion.div>
);

export default Contact;
