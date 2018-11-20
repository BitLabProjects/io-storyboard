import { Crc32 } from "./Utils/Crc32";

enum EOutputType {
  Analog,
  Digital
}

class CTimelineEntry {

  // use percent value
  public static readonly MaxValue: number = 100;

  private static nextKey: number = 0;
  public readonly key: number;

  constructor(
    public Time: number,
    public Value: number,
    public Duration: number,
  ) {
    this.key = CTimelineEntry.nextKey;
    CTimelineEntry.nextKey += 1;
  }

  public clone(): CTimelineEntry {
    return new CTimelineEntry(this.Time, this.Value, this.Duration);
  }

  public compareTo(other: CTimelineEntry): number {
    if (this.Time < other.Time) { return -1; }
    if (this.Time > other.Time) { return 1; }
    if (this.Value < other.Value) { return -1; }
    if (this.Value > other.Value) { return 1; }
    if (this.Duration < other.Duration) { return -1; }
    if (this.Duration > other.Duration) { return 1; }
    return 0;
  }

}

class CTimeline {

  private static nextKey: number = 0;
  public readonly key: number;

  public Entries: CTimelineEntry[];

  constructor(
    public Name: string,
    public HardwareId: string, // base16
    public OutputId: number,
    public OutputType: EOutputType
  ) {
    this.Entries = [];
    this.key = CTimeline.nextKey;
    CTimeline.nextKey += 1;    
  }

  public isForHardwareId(hardwareId: string): boolean {
    return parseInt(hardwareId, 16) === parseInt(this.HardwareId, 16);
  }

  public AddEntry(value: number, duration: number, time?: number): CTimelineEntry {
    if (!time) {
      // if time undefined, calc based on last entry duration
      time = this.mGetNextStartTime();
    }
    const newEntry = new CTimelineEntry(time, value, duration);

    return this.Entries[this.Entries.push(newEntry) - 1];
  }

  public DuplicateEntry(key: number): CTimelineEntry {
    const indexEntry = this.Entries.findIndex((entry, index, a) => entry.key === key);
    const entryToDuplicate = this.Entries[indexEntry];
    this.Entries.splice(indexEntry + 1, 0,
      new CTimelineEntry(entryToDuplicate.Time + 1, entryToDuplicate.Value, entryToDuplicate.Duration));

    return this.Entries[indexEntry + 1];
  }

  public RemoveEntry(key: number) {
    const indexToRemove = this.Entries.findIndex((entry, index, a) => entry.key === key);
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

  public clone(): CTimeline {
    const newTimeline = new CTimeline(this.Name, this.HardwareId, this.OutputId, this.OutputType);
    newTimeline.Entries = this.Entries.map((entry) => {
      return entry.clone();
    });
    return newTimeline;
  }

  public compareTo(other: CTimeline): number {
    if (this.Name < other.Name) { return -1; }
    if (this.Name > other.Name) { return 1; }
    if (this.OutputId < other.OutputId) { return -1; }
    if (this.OutputId > other.OutputId) { return 1; }
    if (this.OutputType < other.OutputType) { return -1; }
    if (this.OutputType > other.OutputType) { return 1; }

    if (this.Entries.length < other.Entries.length) { return -1; }
    if (this.Entries.length > other.Entries.length) { return 1; }

    for (let i = 0; i < this.Entries.length; i++) {
      const thisEntry = this.Entries[i];
      const otherEntry = other.Entries[i];
      const compare = thisEntry.compareTo(otherEntry);
      if (compare !== 0) { return compare; }
    }

    return 0;
  }

  public calcCrc32(initialCrc: number): number {
    let crc32 = initialCrc;
    crc32 = Crc32.crc32_UInt32(parseInt(this.HardwareId, 16), crc32);
    crc32 = Crc32.crc32_UInt8(this.OutputId, crc32);
    crc32 = Crc32.crc32_UInt8(this.Entries.length, crc32);
    this.Entries.forEach((entry) => {
      crc32 = Crc32.crc32_Int32(entry.Time * 1000, crc32);
      crc32 = Crc32.crc32_Int32(entry.Value * 40.95, crc32);
      crc32 = Crc32.crc32_Int32(entry.Duration * 1000, crc32);
    });

    return crc32;
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