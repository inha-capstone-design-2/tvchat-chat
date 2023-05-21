import {CrollingUrl} from "../../utils/crollingUrl";
import axios from "axios";
import cheerio from "cheerio";
import {BroadcastSchedule, ProgramSchedule} from "../../types/types";

class BroadcastService {
    private static instance: BroadcastService;

    private constructor() {}

    public static getInstance(): BroadcastService {
        if (!BroadcastService.instance) {
            BroadcastService.instance = new BroadcastService();
        }
        return BroadcastService.instance;
    }


    async getSchedule(): Promise<BroadcastSchedule> {

        const requests = Object.values(CrollingUrl).map(url => axios.get(url));

        let results: BroadcastSchedule = {};
        await Promise.all(requests)
            .then(responses => {

                responses.forEach((response, index) => {
                    const url = Object.keys(CrollingUrl)[index];
                    const html = response.data;
                    const $ = cheerio.load(html);

                    const items = $('#main_pack > section.sc_new.cs_tvtime._cs_tvtime > div > div.api_cs_wrap > div.tvtime_wrap.page01._tvtime_wrap > div > div.timeline_body._timeline_root > div > div > div > ul > li');

                    const programSchedule: ProgramSchedule[] = [];
                    items.each((index, item) => {
                        const time = $(item).find('div.time_box span');

                        const programName = $(item).find('div.ind_program.col2.today a');

                        if(time.text() !== "" && programName.text() !== "") {
                            programSchedule.push({ program: programName.text(), startTime: time.text()});
                        }

                    })

                    results[url] = programSchedule;

                });

            })
            .catch(error => {
                console.log('Error occurred:', error);
            });

        return results;
    }
}

export default BroadcastService;
