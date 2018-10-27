import BStoryboard from "./BStoryboard";
import { CTimeline, EOutputType } from "./CTimeline";

class CStoryboard {

  public static CreateFromJson(jsonStr: string): CStoryboard {
    const jsonObj = BStoryboard.GetStoryboard1();
    const newStoryboard = new CStoryboard();
    for (const tl of jsonObj.timelines) {
      if (tl.name) {
        const newTimeline = new CTimeline(tl.name, +tl.outputId, +tl.outputType);
        for (const tle of tl.entries) {
          if (tle.value) {
            newTimeline.AddEntry(+tle.value, +tle.duration, +tle.time);
          }
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
        const currTime = entry.Time+entry.Duration;
        if(currTime>maxValue){
          maxValue = currTime;
        }
      }
    }
    return maxValue
  }

  public AddTimeline() {
    this.Timelines.push(new CTimeline("new timeline", 99, EOutputType.Analog));
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

  /* tslint:disable */
  public ExportToJson(): string {
    const timelinesObj = [];
    for (const tl of this.Timelines) {
      const entriesObj = [];
      for (const tle of tl.Entries) {
        // convert value [0-100] -> [0-4095]
        entriesObj.push({ "time": tle.Time, "value": (tle.Value * 40.95).toFixed(0), "duration": tle.Duration });
      }
      //Additional reduntant entry with count of array entries in exported json
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
  /* tslint:enable */

}

export default CStoryboard;
