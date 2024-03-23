import React, { useState, useEffect } from 'react';

const Animation: React.FC = () => {
  const [breed, setBreed] = useState<string>('pug');

  const breeds = ['pug', 'bulldog', 'beagle', 'husky'];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * breeds.length);
      const newBreed = breeds[randomIndex];
      setBreed(newBreed);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="breed-animation">
      <h1>Current Breed: {breed}</h1>
      <img src={`https://dog.ceo/api/breed/${breed}/images/random`} alt={breed} />
    </div>
  );
};

export default Animation;
