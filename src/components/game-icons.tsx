import { Coffee, Briefcase, CreditCard, Utensils, Heart } from 'lucide-react';

export const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      <div className="absolute top-[10%] left-[10%] animate-float">
        <Utensils size={48} />
      </div>
      <div className="absolute top-[20%] right-[15%] animate-float" style={{ animationDelay: '1s' }}>
        <Coffee size={56} />
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float" style={{ animationDelay: '2s' }}>
        <CreditCard size={64} />
      </div>
      <div className="absolute top-[40%] right-[10%] animate-float" style={{ animationDelay: '3s' }}>
        <Briefcase size={40} />
      </div>
      <div className="absolute bottom-[10%] right-[20%] animate-float" style={{ animationDelay: '4s' }}>
        <Heart size={50} />
      </div>
    </div>
  );
};