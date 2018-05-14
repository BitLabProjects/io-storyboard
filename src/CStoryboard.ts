import BStoryboard from "./BStoryboard";
import { CTimeline, EOutputType } from "./CTimeline";

class CStoryboard {  

  public static CreateFromJson(jsonStr: string): CStoryboard {
    // TODO: const jsonObj = JSON.parse(jsonStr);
    const jsonObj = BStoryboard.GetStoryboard0();
    const newStoryboard = new CStoryboard();
    for (const tl of jsonObj.timelines) {
      if (tl.name) {
        const newTimeline = new CTimeline(tl.name, +tl.outputId, +tl.outputType);
        for (const tle of tl.entries) {
          if (tle.value) {
            newTimeline.AddEntry(+tle.time, +tle.value, +tle.duration);
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

  public AddTimeline() {
    this.Timelines.push(new CTimeline("new timeline", 99, EOutputType.Analog));
  }

  public RemoveTimeline(key: number) {
    const indexToRemove = this.Timelines.findIndex((tl, index, a) => tl.Key === key);
    if (indexToRemove > -1) {
      this.Timelines.splice(indexToRemove, 1);
    }    
  }

  public ExportToJson(): string {
    const timelinesObj = [];
    for (const tl of this.Timelines) {
      const entriesObj = [];
      for (const tle of tl.Entries) {
        entriesObj.push({ "time": tle.Time, "value": tle.Value, "duration": tle.Duration });
      }
      timelinesObj.push({
        "entries": entriesObj,
        "name": tl.Name,
        "outputId": tl.OutputId,
        "outputType": tl.OutputType
      });
    }
    return JSON.stringify({ "timelines": timelinesObj });
  }

}

export default CStoryboard;
