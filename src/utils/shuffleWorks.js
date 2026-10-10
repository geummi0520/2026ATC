export const shuffleWorks = (works) => {
  const shuffledWorks = [...works];

  for (let index = shuffledWorks.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledWorks[index], shuffledWorks[randomIndex]] = [
      shuffledWorks[randomIndex],
      shuffledWorks[index],
    ];
  }

  return shuffledWorks;
};
