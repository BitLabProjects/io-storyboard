export class Timer {
  public static async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  // https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940
  public static debounce(func: ((...args: any[]) => void), wait: number): ((...args: any[]) => void) {
    let h: number;
    return (...args: any[]) => {
      window.clearTimeout(h);
      h = window.setTimeout(() => func(...args), wait);
    };
  };

}