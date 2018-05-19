enum EOutputType {
  Analog,
  Digital
}

class CTimelineEntry {

  private static NextKey: number = 0;
  public readonly Key: number;

  constructor(
    public Time: number,
    public Value: number,
    public Duration: number,
  ) {
    this.Key = CTimelineEntry.NextKey;
    CTimelineEntry.NextKey += 1;
  }

}

class CTimeline {

  private static NextKey: number = 0;
  public readonly Key: number;

  public Entries: CTimelineEntry[];

  constructor(
    public Name: string,
    public OutputId: number,
    public OutputType: EOutputType
  ) {
    this.Entries = [];
    this.Key = CTimeline.NextKey;
    CTimeline.NextKey += 1;
  }

  public AddEntry(value: number, duration: number, time?: number): CTimelineEntry {
    // if time undefined, calc based on last entry duration
    let newLength: number;
    if (time) {
      newLength = this.Entries.push(new CTimelineEntry(time, value, duration));
    } else {
      newLength = this.Entries.push(new CTimelineEntry(this.mGetNextStartTime(), value, duration));
    }
    return this.Entries[newLength - 1];
  }

  public RemoveEntry(key: number) {
    const indexToRemove = this.Entries.findIndex((entry, index, a) => entry.Key === key);
    if (indexToRemove > -1) {
      this.Entries.splice(indexToRemove, 1);
    }
  }

  public CheckEntriesOrder(): boolean {
    if (this.Entries.length > 0) {
      let lastTime = this.Entries[0].Time;
      for (const e of this.Entries) {
        if (e.Time > lastTime) {
          lastTime = e.Time;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  // calc start time based on entry position
  private mGetNextStartTime(): number {
    let nextTime = 0;
    if (this.Entries.length > 0) {
      const lastEntry = this.Entries[this.Entries.length - 1];
      nextTime = lastEntry.Time + lastEntry.Duration;
    }
    return nextTime;
  }
}

export { EOutputType, CTimelineEntry, CTimeline };