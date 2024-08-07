import {MESSAGE_TYPE} from "@/datasets/messages";

export default function (action: 'show_dev'|'hide_dev'){
    window.postMessage({type: MESSAGE_TYPE, action: action}, "*");
}