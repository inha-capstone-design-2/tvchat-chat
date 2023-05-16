import express from 'express';
import cheerio from 'cheerio';
import axios from "axios";
import BroadcastService from '../services/broadcastService';
const router = express.Router();

const broadcastService = BroadcastService.getInstance();



router.get('/', async(req, res, next) => {
    try {

        const urls = {
            kbs1: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=kbs1%ED%8E%B8%EC%84%B1%ED%91%9C",
            kbs2: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=kbs2%20%ED%8E%B8%EC%84%B1%ED%91%9C",
            mbc: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=mbc%ED%8E%B8%EC%84%B1%ED%91%9C",
            sbs: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=mbc%ED%8E%B8%EC%84%B1%ED%91%9C",
            ebs1: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=ebs1%20%ED%8E%B8%EC%84%B1%ED%91%9C",
            ebs2: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=ebs1%20%ED%8E%B8%EC%84%B1%ED%91%9C",
            jtbc: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=jtbc%ED%8E%B8%EC%84%B1%ED%91%9C",
            mbn: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=mbn%ED%8E%B8%EC%84%B1%ED%91%9C",
            tv_josun: "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=tv%EC%A1%B0%EC%84%A0%ED%8E%B8%EC%84%B1%ED%91%9C",
            channelA:"https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&qvt=0&query=%EC%B1%84%EB%84%90a%ED%8E%B8%EC%84%B1%ED%91%9C",
        }

        const requests = Object.values(urls).map(url => axios.get(url));

        let results: any = {};
        await Promise.all(requests)
            .then(responses => {

                responses.forEach((response, index) => {
                    const url = Object.keys(urls)[index];
                    const html = response.data;
                    const $ = cheerio.load(html);

                    const items = $('#main_pack > section.sc_new.cs_tvtime._cs_tvtime > div > div.api_cs_wrap > div.tvtime_wrap.page01._tvtime_wrap > div > div.timeline_body._timeline_root > div > div > div > ul > li');

                    const programs: { program: string, startTime: string }[] = [];
                    items.each((index, item) => {
                        const time = $(item).find('div.time_box span');

                        const programName = $(item).find('div.ind_program.col2.today a');

                        if(time.text() !== "" && programName.text() !== "") {
                            programs.push({ program: programName.text(), startTime: time.text()});
                        }

                    })

                    results[url] = programs;

                });

            })
            .catch(error => {
                console.log('Error occurred:', error);
            });

            res.json(results);

    } catch (error) {
        next(error);
    }
})


export default router;
