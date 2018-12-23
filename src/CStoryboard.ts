import { CTimeline, EOutputType, CTimelineEntry } from "./CTimeline";
import { Crc32 } from "./Utils/Crc32";

export interface ITimelineEntryJson {
  time: number;
  value: number;
  duration: number;
}

export interface ITimelineJson {
  name: string;
  outputHardwareId: number; // base10
  outputId: number;
  outputType: number;
  entriesCount: number;
  entries: ITimelineEntryJson[];
  reversed?: boolean;
}

export interface IOutputBoardJson {
  hardwareId: number; // base10
  trimInterval: number;
}

export interface IStoryboardJson {
  duration: number;
  outputBoards?: IOutputBoardJson[],
  timelinesCount: number;
  timelines: ITimelineJson[];
}

export class COutputBoard {
  constructor(public HardwareId: string,
    public TrimInterval: number) {
  }

  public isForHardwareId(hardwareId: string): boolean {
    return parseInt(hardwareId, 16) === parseInt(this.HardwareId, 16);
  }
}

class CStoryboard {

  public static CreateFromJson(sb: IStoryboardJson): CStoryboard {
    // const jsonObj = BStoryboard.GetStoryboard2();    
    const newStoryboard = new CStoryboard();
    for (const tl of sb.timelines) {
      if (tl.name) {
        const reversed = tl.reversed || false;
        const newTimeline = new CTimeline(tl.name, tl.outputHardwareId.toString(16).toUpperCase(), tl.outputId, reversed, tl.outputType);
        for (const tle of tl.entries) {
          // convert time values from milliseconds to seconds
          // convert value [0-4095] -> [0-100]
          const value = reversed ? 4095 - tle.value : tle.value;
          newTimeline.AddEntry(value / 40.95, tle.duration / 1000, tle.time / 1000);

        }
        newStoryboard.Timelines.push(newTimeline);
      }
    }
    // update time range    
    newStoryboard.ExportTimeRange[1] = newStoryboard.MaxTime;
    return newStoryboard;
  }

  public Timelines: CTimeline[];
  public OutputBoards: COutputBoard[];

  // export sub-storyboard within the range [startTime, endTime] 
  public ExportTimeRange: [number, number];

  constructor() {
    this.Timelines = [];
    this.OutputBoards = [];
    this.ExportTimeRange = [0, Number.POSITIVE_INFINITY];
  }

  public get Duration(): number {
    return this.MaxTime * 1000;
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
    return maxValue;
  }

  public AddTimeline() {
    const newTL = new CTimeline("new timeline", "AABBCCDD", 99, false, EOutputType.Analog);
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

  public ExportToJson(skipEmptyEntries: boolean = false, appendResetEntries: boolean = false): IStoryboardJson {
    const timelinesObj: ITimelineJson[] = [];
    for (const tl of this.Timelines) {
      const entriesObj: ITimelineEntryJson[] = [];
      for (const tle of tl.Entries) {
        if ((tle.Time >= this.ExportTimeRange[0]) && (tle.Time + tle.Duration <= this.ExportTimeRange[1])) {
          // entry within range
          // convert back time values from seconds to milliseconds
          // convert back value [0-100] -> [0-4095]
          const value = tl.Reversed ? CTimelineEntry.MaxValue - tle.Value : tle.Value;
          // push back the start time to 0
          const time = tle.Time - this.ExportTimeRange[0];
          entriesObj.push({
            time: time * 1000,
            value: +(value * 40.95).toFixed(0),
            duration: tle.Duration * 1000
          });
        }
      }

      if (entriesObj.length === 0 && skipEmptyEntries) {
        // Don't export
      } else {
        if (appendResetEntries && (entriesObj.length > 8)) {
          // hardware support 10 entries/timeline
          alert(`More than 8 entries for ${tl.Name}`)
        }
        if (appendResetEntries && (entriesObj.length > 0)) {
          // ensure reset entries for hardware
          const maxTime = entriesObj[entriesObj.length - 1].time + entriesObj[entriesObj.length - 1].duration;
          entriesObj.push({
            time: (maxTime + 1000),
            value: 0,
            duration: 0
          });
          entriesObj.push({
            time: (maxTime + 2000),
            value: 0,
            duration: 0
          });
        }

        // Additional reduntant entry with count of array entries in exported json
        timelinesObj.push({
          name: tl.Name,
          outputHardwareId: parseInt(tl.HardwareId, 16),
          outputId: tl.OutputId,
          outputType: tl.OutputType,
          entriesCount: entriesObj.length,
          entries: entriesObj,
          reversed: tl.Reversed,
        });
      }
    }

    const outputBoardsObj: IOutputBoardJson[] = [];
    for (const ob of this.OutputBoards) {
      outputBoardsObj.push({
        hardwareId: parseInt(ob.HardwareId, 10),
        trimInterval: ob.TrimInterval
      })
    }

    const timeGapForResetEntries = appendResetEntries ? 3000 : 0;

    // Do not output empty arrays as the current parser has bugs with them
    if (outputBoardsObj.length > 0) {
      return {
        duration: this.Duration + timeGapForResetEntries,
        outputBoards: outputBoardsObj,
        timelinesCount: timelinesObj.length,
        timelines: timelinesObj
      };
    } else {
      return {
        duration: this.Duration + timeGapForResetEntries,
        timelinesCount: timelinesObj.length,
        timelines: timelinesObj
      };
    }
  }

  public calcCrc32(hardwareIdOrNullForall: string | null, initialCrc: number): number {
    let crc32 = initialCrc;
    crc32 = Crc32.crc32_UInt8(123, crc32);

    const timelinesForHardwareId = this.Timelines.filter((timeline) => {
      return (hardwareIdOrNullForall === null || timeline.isForHardwareId(hardwareIdOrNullForall));
    });
    crc32 = Crc32.crc32_UInt8(timelinesForHardwareId.length, crc32);
    crc32 = Crc32.crc32_Int32(this.Duration, crc32);
    timelinesForHardwareId.forEach((timeline) => {
      crc32 = timeline.calcCrc32(crc32);
    });
    return crc32;
  }

  public getTrimIntervalByHardwareId(hardwareId: string): number {
    for (const outputBoard of this.OutputBoards) {
      if (outputBoard.isForHardwareId(hardwareId)) {
        return outputBoard.TrimInterval;
      }
    }
    return 0;
  }

  public setTrimIntervalByHardwareId(hardwareId: string, value: number) {
    for (const outputBoard of this.OutputBoards) {
      if (outputBoard.isForHardwareId(hardwareId)) {
        outputBoard.TrimInterval = value;
        return;
      }
    }
    this.OutputBoards.push(new COutputBoard(hardwareId, value));
  }
}

export default CStoryboard;
