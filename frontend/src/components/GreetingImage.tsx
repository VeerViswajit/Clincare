import React from 'react';

interface GreetingImageProps {
  imageUrl: string;
  fullName: string;
}

const GreetingImage: React.FC<GreetingImageProps> = ({ imageUrl, fullName }) => {
  return (
    <div className="relative w-screen h-[50vh]">
      <img src={imageUrl} alt="Greeting" className="w-full h-full object-cover" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl sm:text-2xl md:text-3xl shadow-md">
        Greetings Dr. {fullName}
      </div>
    </div>
  );
};

export default GreetingImage;
