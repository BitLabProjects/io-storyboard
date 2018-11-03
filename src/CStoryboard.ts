import { CTimeline, EOutputType } from "./CTimeline";

export interface IStoryboard {
  "timelinesCount": number;
  "timelines": Array<{
    "name": string;
    "outputId": number;
    "outputType": number;
    "entriesCount": number;
    "entries": Array<{
      "time": number;
      "value": number;
      "duration": number;
    }>;
  }>;
}

class CStoryboard {

  public static CreateFromJson(sb: IStoryboard): CStoryboard {
    // const jsonObj = BStoryboard.GetStoryboard2();    
    const newStoryboard = new CStoryboard();
    for (const tl of sb.timelines) {
      if (tl.name) {
        const newTimeline = new CTimeline(tl.name, tl.outputId, tl.outputType);
        for (const tle of tl.entries) {
          // convert time values from milliseconds to seconds
          // convert value [0-4095] -> [0-100]
          newTimeline.AddEntry(tle.value / 40.95, tle.duration / 1000, tle.time / 1000);
        }
        if (tl.entries.length === 0) {
          // at least one empty entry
          newTimeline.AddEntry(0, 0, 0);
        }
        newStoryboard.Timelines.push(newTimeline);
      }
    }
    return newStoryboard;
  }

  public Timelines: CTimeline[];

  constructor() {
    this.Timelines = [];
  }

  public get MaxTime(): number {
    let maxValue: number = 0;
    for (const timeline of this.Timelines) {
      for (const entry of timeline.Entries) {
        const currTime = entry.Time + entry.Duration;
        if (currTime > maxValue) {
          maxValue = currTime;
        }
      }
    }
    return maxValue
  }

  public AddTimeline() {
    const newTL = new CTimeline("new timeline", 99, EOutputType.Analog);
    // at least one empty entry
    newTL.AddEntry(0, 0, 0);
    this.Timelines.push(newTL);
  }

  public RemoveTimeline(key: number) {
    const indexToRemove = this.Timelines.findIndex((tl, index, a) => tl.key === key);
    if (indexToRemove > -1) {
      this.Timelines.splice(indexToRemove, 1);
    }
  }

  public clone(): CStoryboard {
    const newStoryboard = new CStoryboard();
    newStoryboard.Timelines = this.Timelines.map((timeline) => {
      return timeline.clone();
    });
    return newStoryboard;
  }

  public ExportToJson(): string {
    const timelinesObj = [];
    for (const tl of this.Timelines) {
      const entriesObj = [];
      for (const tle of tl.Entries) {
        // convert back time values from seconds to milliseconds
        // convert back value [0-100] -> [0-4095]
        entriesObj.push({
          "time": tle.Time * 1000,
          "value": +(tle.Value * 40.95).toFixed(0),
          "duration": tle.Duration * 1000
        });
      }
      // Additional reduntant entry with count of array entries in exported json
      timelinesObj.push({
        "name": tl.Name,
        "outputId": tl.OutputId,
        "outputType": tl.OutputType,
        "entriesCount": entriesObj.length,
        "entries": entriesObj
      });
    }
    return JSON.stringify({
      "timelinesCount": timelinesObj.length,
      "timelines": timelinesObj
    });
  }

}

export default CStoryboard;
