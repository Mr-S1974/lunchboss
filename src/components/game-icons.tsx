import { Briefcase, Coffee, CreditCard, Heart, Utensils } from 'lucide-react';

export const FloatingIcons = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.08]">
      <div className="absolute left-[8%] top-[12%] animate-float text-primary">
        <Utensils size={42} strokeWidth={1.6} />
      </div>
      <div className="absolute right-[12%] top-[18%] animate-float text-secondary" style={{ animationDelay: '1s' }}>
        <Coffee size={48} strokeWidth={1.6} />
      </div>
      <div className="absolute bottom-[18%] left-[18%] animate-float text-accent" style={{ animationDelay: '2s' }}>
        <CreditCard size={54} strokeWidth={1.6} />
      </div>
      <div className="absolute right-[8%] top-[42%] animate-float text-foreground" style={{ animationDelay: '3s' }}>
        <Briefcase size={36} strokeWidth={1.6} />
      </div>
      <div className="absolute bottom-[10%] right-[18%] animate-float text-primary" style={{ animationDelay: '4s' }}>
        <Heart size={40} strokeWidth={1.6} />
      </div>
    </div>
  );
};
