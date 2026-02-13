import React from "react";
import { Sparkles, Heart, Rocket, Shield } from "lucide-react";

const About = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl w-full space-y-12 animate-[slideUp_0.6s_ease-out]">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                        Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Dobby AI</span>
                    </h1>
                    <p className="text-zinc-400 text-lg font-medium max-w-xl mx-auto">
                        Your friendly, fast, and secure AI companion designed to make your daily tasks effortless and fun.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Heart className="w-6 h-6 text-red-400" />}
                        title="User First"
                        description="Designed with a focus on simplicity and ease of use, making AI accessible to everyone."
                    />
                    <FeatureCard
                        icon={<Rocket className="w-6 h-6 text-blue-400" />}
                        title="Fast & Fluid"
                        description="Built on cutting-edge tech to provide instant responses and a smooth chat experience."
                    />
                    <FeatureCard
                        icon={<Shield className="w-6 h-6 text-green-400" />}
                        title="Private"
                        description="Your data and chats are secure, giving you peace of mind while you explore."
                    />
                </div>

                {/* Story Section */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 space-y-6">
                    <h2 className="text-2xl font-black text-white">Our Mission</h2>
                    <p className="text-zinc-400 leading-relaxed font-medium">
                        Dobby AI was born from the idea that AI shouldn't be cold and clinical. It should be a helpful friend who understands you. We're constantly working to improve Dobby's capabilities while keeping its personality warm and conversational.
                    </p>
                </div>
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

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-white/[0.06] hover:border-white/10 transition-all group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-black text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed">{description}</p>
    </div>
);

export default About;
