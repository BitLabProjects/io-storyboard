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

  public AddEntry(time: number, value: number, duration: number) {
    this.Entries.push(new CTimelineEntry(time, value, duration));
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

}

export { EOutputType, CTimelineEntry, CTimeline };