const flipAnim = {
  show: {
    y: ['100%', '0%'],
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
  hide: {
    y: '-100%',
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
      when: 'afterChildren',
    },
  },
}

export { flipAnim }
