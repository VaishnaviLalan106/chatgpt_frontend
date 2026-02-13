import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Rocket, Shield } from "lucide-react";

const About = () => {
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
                className="max-w-3xl w-full space-y-10 md:space-y-12"
            >
                {/* Hero */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 rounded-full animate-gentle-pulse"
                            style={{ background: `radial-gradient(circle, var(--blob-1) 0%, transparent 70%)`, filter: 'blur(15px)' }} />
                        <div className="relative w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-2xl animate-breathe"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter" style={{ color: 'var(--text-heading)' }}>
                        Meet{" "}
                        <span style={{
                            backgroundImage: 'linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>Dobby AI</span>
                    </h1>
                    <p className="text-base md:text-lg font-medium max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        Your friendly, fast, and secure AI companion designed to make your daily tasks effortless and fun.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <FeatureCard
                        icon={<Heart className="w-6 h-6 text-rose-400" />}
                        title="User First"
                        description="Designed with a focus on simplicity and ease of use, making AI accessible to everyone."
                        glowColor="rgba(244,63,94,0.08)"
                    />
                    <FeatureCard
                        icon={<Rocket className="w-6 h-6 text-blue-400" />}
                        title="Fast & Fluid"
                        description="Built on cutting-edge tech to provide instant responses and a smooth chat experience."
                        glowColor="rgba(59,130,246,0.08)"
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-emerald-400" />}
                        title="Private"
                        description="Your data and chats are secure, giving you peace of mind while you explore."
                        glowColor="rgba(16,185,129,0.08)"
                    />
                </motion.div>

                {/* Mission */}
                <motion.div
                    variants={itemVariants}
                    className="p-6 sm:p-8 md:p-10 space-y-5 rounded-[2rem]"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <h2 className="text-xl md:text-2xl font-extrabold" style={{ color: 'var(--text-heading)' }}>Our Mission</h2>
                    <p className="leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Dobby AI was born from the idea that AI shouldn't be cold and clinical. It should be a helpful friend who understands you. We're constantly working to improve Dobby's capabilities while keeping its personality warm and conversational.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, glowColor }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="p-5 md:p-6 rounded-2xl transition-all group cursor-default"
        style={{
            background: glowColor,
            border: '1px solid var(--border-subtle)',
        }}
    >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            style={{ background: 'var(--bg-card-hover)' }}>
            {icon}
        </div>
        <h3 className="text-lg font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-heading)' }}>{title}</h3>
        <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </motion.div>
);

export default About;
