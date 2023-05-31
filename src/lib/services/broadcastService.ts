import {CrollingUrl} from "../../utils/crollingUrl";
import axios from "axios";
import cheerio from "cheerio";
import {ProgramSchedules, ProgramSchedule} from "../../types/types";

class BroadcastService {
    private static instance: BroadcastService;

    private constructor() {}

    public static getInstance(): BroadcastService {
        if (!BroadcastService.instance) {
            BroadcastService.instance = new BroadcastService();
        }
        return BroadcastService.instance;
    }


    async getSchedule(): Promise<ProgramSchedules> {

        const requests = Object.values(CrollingUrl).map(url => axios.get(url));

        let results: ProgramSchedules = [];

        await Promise.all(requests)
            .then(responses => {

                responses.forEach((response, index) => {
                    const broadcastor = Object.keys(CrollingUrl)[index];
                    const html = response.data;
                    const $ = cheerio.load(html);

                    const items = $('#main_pack > section.sc_new.cs_tvtime._cs_tvtime > div > div.api_cs_wrap > div.tvtime_wrap.page01._tvtime_wrap > div > div.timeline_body._timeline_root > div > div > div > ul > li');

                    let programSchedules: ProgramSchedule[] = [];

                    items.each((index, item) => {

                        let programSchedule: any = [];

                        const time = $(item).find('div.time_box span');

                        const programHour = parseInt(time.text().replace(/[^0-9]/g, ""));

                        const programNames = $(item).find('div.ind_program.col2.today a');

                        programNames.each((index, item) => {
                            const programName = $(item).text();

                            programSchedule[index] = { program: programName, broadcastor: broadcastor };
                        })

                        const programMinutes = $(item).find('div.ind_program.col2.today div.time_min');

                        programMinutes.each((index, item) => {

                            if(programSchedule[index]) {
                                const minute = $(item).text();

                                const programTime = new Date();

                                programTime.setHours(programHour + 9);
                                programTime.setMinutes(parseInt(minute));
                                programTime.setSeconds(0);
                                programTime.setMilliseconds(0);

                                programSchedule[index].startTime = programTime;
                            }

                        })

                        if(programSchedule.length !== 0) {
                            programSchedules.push(...programSchedule);
                        }

                    })

                    results.push(...programSchedules);

                });

            })
            .catch(error => {
                console.log('Error occurred:', error);
            });


        for (let i = 1; i < results.length; i++) {
            const previousIndex = i - 1;
            results[previousIndex].endTime = results[i].startTime;
        }

        for (let i = 0; i < results.length; i++) {
            if(!results[i].endTime) {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                tomorrow.setHours(tomorrow.getHours() + 9);
                results[i].endTime = tomorrow;
            }
        }

        return results;
    }
}

export default BroadcastService;
