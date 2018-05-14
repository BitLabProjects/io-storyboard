enum EOutputType {
  Analog,
  Digital
}

class CTimelineEntry {

  private static NextKey:number = 0;  
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
  public Entries: CTimelineEntry[];

  constructor(
    public Name: string,
    public OutputId: number,
    public OutputType: EOutputType
  ) {
    this.Entries = [];
  }

  public AddEntry(value: number, duration: number) {
    this.mAddEntryWithoutRecalc(value, duration);
    this.mRecalcEntries();
  }

  public RemoveEntry(key: number) {
    const indexToRemove = this.Entries.findIndex((entry, index, a) => entry.Key === key);
    if (indexToRemove > -1) {
      this.Entries.splice(indexToRemove, 1);
    }
    this.mRecalcEntries();
  }

  // recalc entries time
  private mRecalcEntries() {
    // clone array
    const oldEntries = this.Entries.slice();
    // empty original array
    this.Entries.splice(0);
    // re-add entries
    for (const e of oldEntries) {
      this.mAddEntryWithoutRecalc(e.Value, e.Duration);
    }
  }

  private mAddEntryWithoutRecalc(value: number, duration: number) {
    const nextTime = this.mGetNextStartTime();
    this.Entries.push(new CTimelineEntry(nextTime, value, duration));
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