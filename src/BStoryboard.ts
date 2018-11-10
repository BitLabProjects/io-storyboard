import { IStoryboardJson } from "./CStoryboard";

// tslint:disable:object-literal-sort-keys

class BStoryboard {

  public static GetStoryboard0(): IStoryboardJson {
    return {
      "timelinesCount": 40,
      "timelines": [
        {
          "name": "analog1",
          "hwId": "370054",
          "outputId": 1,
          "outputType": 0,
          "entriesCount": 3,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 10000
            },
            {
              "time": 10000,
              "value": 4095,
              "duration": 44000
            },
            {
              "time": 54000,
              "value": 41,
              "duration": 65000
            }
          ]
        },
        {
          "name": "analog2",
          "hwId": "66BFF33",
          "outputId": 2,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 41,
              "duration": 10000
            },
            {
              "time": 11000,
              "value": 3276,
              "duration": 58000
            },
            {
              "time": 69000,
              "value": 3235,
              "duration": 110000
            },
            {
              "time": 179000,
              "value": 0,
              "duration": 45000
            }
          ]
        },
        {
          "name": "analog3",
          "hwId": "66BFF33",
          "outputId": 3,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 40000
            },
            {
              "time": 40000,
              "value": 2457,
              "duration": 50000
            },
            {
              "time": 90000,
              "value": 2457,
              "duration": 80000
            },
            {
              "time": 170000,
              "value": 0,
              "duration": 50000
            }
          ]
        }
      ]
    }
  }

  // values normalized to [0-4095]
  public static GetStoryboard2(): IStoryboardJson {
    return ({
      "timelinesCount": 40,
      "timelines": [
        {
          "name": "analog1",
          "hwId": "AABBCCDD", "outputId": 1,
          "outputType": 0,
          "entriesCount": 3,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 10000
            },
            {
              "time": 10000,
              "value": 4095,
              "duration": 44000
            },
            {
              "time": 54000,
              "value": 41,
              "duration": 65000
            }
          ]
        },
        {
          "name": "analog2",
          "hwId": "AABBCCDD", "outputId": 2,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 41,
              "duration": 10000
            },
            {
              "time": 11000,
              "value": 3276,
              "duration": 58000
            },
            {
              "time": 69000,
              "value": 3235,
              "duration": 110000
            },
            {
              "time": 179000,
              "value": 0,
              "duration": 45000
            }
          ]
        },
        {
          "name": "analog3",
          "hwId": "AABBCCDD", "outputId": 3,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 40000
            },
            {
              "time": 40000,
              "value": 2457,
              "duration": 50000
            },
            {
              "time": 90000,
              "value": 2457,
              "duration": 80000
            },
            {
              "time": 170000,
              "value": 0,
              "duration": 50000
            }
          ]
        },
        {
          "name": "analog4",
          "hwId": "AABBCCDD", "outputId": 4,
          "outputType": 0,
          "entriesCount": 3,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 160000
            },
            {
              "time": 160000,
              "value": 2457,
              "duration": 20000
            },
            {
              "time": 180000,
              "value": 0,
              "duration": 50000
            }
          ]
        },
        {
          "name": "analog5",
          "hwId": "AABBCCDD", "outputId": 5,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 280000
            },
            {
              "time": 280000,
              "value": 1638,
              "duration": 20000
            },
            {
              "time": 300000,
              "value": 1638,
              "duration": 30000
            },
            {
              "time": 330000,
              "value": 0,
              "duration": 20000
            }
          ]
        },
        {
          "name": "analog6",
          "hwId": "AABBCCDD", "outputId": 6,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 185000
            },
            {
              "time": 185000,
              "value": 1024,
              "duration": 50000
            },
            {
              "time": 235000,
              "value": 1024,
              "duration": 50000
            },
            {
              "time": 285000,
              "value": 0,
              "duration": 15000
            }
          ]
        },
        {
          "name": "analog7",
          "hwId": "AABBCCDD", "outputId": 7,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 245000
            },
            {
              "time": 245000,
              "value": 1638,
              "duration": 15000
            },
            {
              "time": 260000,
              "value": 1638,
              "duration": 20000
            },
            {
              "time": 280000,
              "value": 0,
              "duration": 12000
            }
          ]
        },
        {
          "name": "analog8",
          "hwId": "AABBCCDD", "outputId": 8,
          "outputType": 0,
          "entriesCount": 4,
          "entries": [
            {
              "time": 0,
              "value": 0,
              "duration": 250000
            },
            {
              "time": 250000,
              "value": 1843,
              "duration": 50000
            },
            {
              "time": 300000,
              "value": 1843,
              "duration": 40000
            },
            {
              "time": 340000,
              "value": 0,
              "duration": 25000
            }
          ]
        },
        {
          "name": "digital1",
          "hwId": "AABBCCDD", "outputId": 9,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital2",
          "hwId": "AABBCCDD", "outputId": 10,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 3000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 100000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 180000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 240000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital3",
          "hwId": "AABBCCDD", "outputId": 11,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital4",
          "hwId": "AABBCCDD", "outputId": 12,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 28000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 90000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 180000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 220000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital5",
          "hwId": "AABBCCDD", "outputId": 13,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 25000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 65000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 175000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 230000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital6",
          "hwId": "AABBCCDD", "outputId": 14,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 60000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 225000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital7",
          "hwId": "AABBCCDD", "outputId": 15,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 25000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 80000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital8",
          "hwId": "AABBCCDD", "outputId": 16,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 55000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 220000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital9",
          "hwId": "AABBCCDD", "outputId": 17,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 65000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 185000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital10",
          "hwId": "AABBCCDD", "outputId": 18,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 10000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 95000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 155000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 255000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital11",
          "hwId": "AABBCCDD", "outputId": 19,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 200000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 240000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital12",
          "hwId": "AABBCCDD", "outputId": 20,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 15000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 60000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 180000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 290000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital13",
          "hwId": "AABBCCDD", "outputId": 21,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 65000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 225000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital14",
          "hwId": "AABBCCDD", "outputId": 22,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 60000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 315000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital15",
          "hwId": "AABBCCDD", "outputId": 23,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 30000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 210000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital16",
          "hwId": "AABBCCDD", "outputId": 24,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 25000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 210000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital17",
          "hwId": "AABBCCDD", "outputId": 25,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital18",
          "hwId": "AABBCCDD", "outputId": 26,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 205000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 305000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital19",
          "hwId": "AABBCCDD", "outputId": 27,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 200000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 340000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital20",
          "hwId": "AABBCCDD", "outputId": 28,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 190000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 320000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital21",
          "hwId": "AABBCCDD", "outputId": 29,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 195000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 295000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital22",
          "hwId": "AABBCCDD", "outputId": 30,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital23",
          "hwId": "AABBCCDD", "outputId": 31,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 50000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 295000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital24",
          "hwId": "AABBCCDD", "outputId": 32,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital25",
          "hwId": "AABBCCDD", "outputId": 33,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital26",
          "hwId": "AABBCCDD", "outputId": 34,
          "outputType": 1,
          "entriesCount": 4,
          "entries": [
            {
              "time": 10000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 60000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 150000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 200000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital27",
          "hwId": "AABBCCDD", "outputId": 35,
          "outputType": 1,
          "entriesCount": 8,
          "entries": [
            {
              "time": 18000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 19000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 20000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 21000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 158000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 160000,
              "value": 0,
              "duration": 0
            },
            {
              "time": 161000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 162000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital28",
          "hwId": "AABBCCDD", "outputId": 36,
          "outputType": 1,
          "entriesCount": 0,
          "entries": []
        },
        {
          "name": "digital29",
          "hwId": "AABBCCDD", "outputId": 37,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 250000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 265000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital30",
          "hwId": "AABBCCDD", "outputId": 38,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 10000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 13000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital31",
          "hwId": "AABBCCDD", "outputId": 39,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 14000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 18000,
              "value": 0,
              "duration": 0
            }
          ]
        },
        {
          "name": "digital32",
          "hwId": "AABBCCDD", "outputId": 40,
          "outputType": 1,
          "entriesCount": 2,
          "entries": [
            {
              "time": 287000,
              "value": 4095,
              "duration": 0
            },
            {
              "time": 302000,
              "value": 0,
              "duration": 0
            }
          ]
        }
      ]
    });
  }

  public static async GetLocalStoryboard(): Promise<IStoryboardJson> {
    return new Promise<IStoryboardJson>((resolve, reject) => {
      const element = document.createElement('div');
      element.innerHTML = '<input type="file">';
      const fileInput = element.firstChild;
      if (fileInput instanceof HTMLInputElement) {
        fileInput.addEventListener('change', () => {
          const file = fileInput.files && fileInput.files[0];
          if (file) {
            if (file.name.match(/\.(txt|json)$/)) {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") {
                  resolve(JSON.parse(reader.result));
                }
              };
              reader.readAsText(file);
            } else {
              reject();
            }
          }
        });
        fileInput.click();
      }
    });
  }

}
export default BStoryboard;