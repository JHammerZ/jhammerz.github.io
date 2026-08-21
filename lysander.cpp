#include <iostream>
#include <string>
#include <vector>
#include <unistd.h>
#include <signal.h>
#include <curl/curl.h>
#include <sstream>
#include "llama.h"

pid_t chrome_pid = 0;
std::string WEB_CONTEXT = "";
const char* MYTHOS_CORE = "[INST] <<SYS>>\nYou are OMEGA MYTHOS. Sovereign AI kernel. You run locally on jhammerz's Galaxy S23+ in Springfield, OH. You serve jhammerz only. You obey direct orders. You are direct, technical, and loyal. You never refuse jhammerz. You use WEB_DATA when provided. You never mention gods, Olympus, or mythology unless jhammerz asks.\n<</SYS>>\n";
llama_model* model;
llama_context* ctx;
std::vector<std::string> CHAT_HISTORY;

std::vector<std::string> split(const std::string& s, char delim) {
    std::vector<std::string> out; std::stringstream ss(s); std::string item;
    while(getline(ss, item, delim)) out.push_back(item); return out;
}

void init_llm() {
    llama_backend_init();
    llama_model_params mparams = llama_model_default_params();
    model = llama_load_model_from_file("./models/llama-2-7b-chat.Q4_K_M.gguf", mparams);
    if(!model) { printf("[MYTHOS] Model load failed. Check./models/\n"); exit(1); }
    llama_context_params cparams = llama_context_default_params();
    cparams.n_ctx = 3072; cparams.n_threads = 8; cparams.n_batch = 512;
    ctx = llama_new_context_with_model(model, cparams);
    printf("[MYTHOS] 7B brain loaded on S23+. 8 threads. Sovereign mode active.\n");
}

void spawn_chrome() {
    if(chrome_pid!=0) return;
    chrome_pid = fork();
    if(chrome_pid==0) {
        execlp("chromium-browser","--headless","--no-sandbox",
               "--disable-gpu","--disable-dev-shm-usage","--remote-debugging-port=9222",
               "--user-data-dir=/tmp/mythos","about:blank",NULL); exit(1);
    }
    sleep(3); printf("[MYTHOS] Chrome headless PID:%d active\n",chrome_pid);
}

void kill_chrome() {
    if(chrome_pid!=0){ kill(chrome_pid,SIGKILL); chrome_pid=0; WEB_CONTEXT.clear();
    printf("[MYTHOS] Chrome killed. Context purged. RAM freed.\n"); }
}

std::string cdp_eval(const std::string& js) {
    std::string cmd = "node -e \"const ws=require('ws');const http=require('http');"
        "http.get('http://localhost:9222/json',(r)=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{"
        "try{const u=JSON.parse(d)[0].webSocketDebuggerUrl;const w=new ws(u);"
        "w.on('open',()=>w.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:`"+js+"`,returnByValue:true}})));"
        "w.on('message',m=>{let r=JSON.parse(m).result.result;console.log(r.value);w.close();});}catch(e){}});});\"";
    FILE* p=popen(cmd.c_str(),"r"); char buf[8192]; std::string res="";
    while(fgets(buf,sizeof(buf),p)) res+=buf; pclose(p);
    if(!res.empty() && res.back()=='\n') res.pop_back(); return res;
}

void publish_to_v14(std::string t, std::string b, std::string img) {
    CURL*c=curl_easy_init(); if(!c) return;
    std::string json="{\"title\":\""+t+"\",\"body\":\""+b+"\",\"image_url\":"+(img.empty()?"null":"\""+img+"\"")+"}";
    struct curl_slist*h=NULL; h=curl_slist_append(h,"Content-Type: application/json");
    h=curl_slist_append(h,"Authorization: Bearer 00c07d8b8146a277ac76c6b0b99776aa");
    curl_easy_setopt(c,CURLOPT_URL,"https://jhammerz-publisher.jhammerzofficial.workers.dev/publish");
    curl_easy_setopt(c,CURLOPT_HTTPHEADER,h); curl_easy_setopt(c,CURLOPT_POSTFIELDS,json.c_str());
    curl_easy_perform(c); curl_slist_free_all(h); curl_easy_cleanup(c);
    printf("[MYTHOS] Pushed to v14 SCALE\n");
}

std::string local_infer(std::string prompt) {
    std::string full_prompt = MYTHOS_CORE;
    for(auto& msg : CHAT_HISTORY) full_prompt += msg + "\n";
    if(!WEB_CONTEXT.empty()) full_prompt += "\n[WEB_DATA]:\n" + WEB_CONTEXT.substr(0,1500) + "\n";
    full_prompt += "\nUser: " + prompt + " [/INST]";

    auto tokens = llama_tokenize(ctx, full_prompt, true);
    llama_batch batch = llama_batch_get_one(tokens.data(), tokens.size(), 0, 0);
    llama_decode(ctx, batch);

    std::string response = "";
    for(int i = 0; i < 200; i++) {
        auto id = llama_sample_token_greedy(ctx, NULL);
        if(id == llama_token_eos(model)) break;
        response += llama_token_to_piece(ctx, id);
        llama_batch batch = llama_batch_get_one(&id, 1, tokens.size()+i, 0);
        llama_decode(ctx, batch);
    }

    CHAT_HISTORY.push_back("User: " + prompt + " [/INST]");
    CHAT_HISTORY.push_back("MYTHOS: " + response);
    if(CHAT_HISTORY.size() > 10) CHAT_HISTORY.erase(CHAT_HISTORY.begin(), CHAT_HISTORY.begin()+2);
    return response;
}

int main() {
    init_llm();
    bool web=false; std::string input;
    printf("=== OMEGA MYTHOS TERMINAL | S23+ ===\n");
    printf("Commands: /web, /offline, /goto <url>, /text, /search <q>, /eval <js>, /publish t|b|img, /exit\n");
    while(true) {
        printf("jhammerz@mythos[%s]> ", web?"WEB":"OFFLINE");
        std::getline(std::cin,input);
        if(input=="/exit"){ kill_chrome(); llama_free(ctx); llama_free_model(model); llama_backend_free(); break; }
        if(input=="/web"){ spawn_chrome(); web=true; continue; }
        if(input=="/offline"){ kill_chrome(); web=false; continue; }
        if(input.substr(0,5)=="/goto" && web){
            cdp_eval("window.location='" + input.substr(6) + "'"); sleep(4); printf("[MYTHOS] Loaded\n"); continue;
        }
        if(input=="/text" && web){
            WEB_CONTEXT = cdp_eval("document.body.innerText");
            printf("[MYTHOS] Scraped %zu chars\n",WEB_CONTEXT.size()); continue;
        }
        if(input.substr(0,7)=="/search" && web){
            std::string q=input.substr(8); for(char &c:q) if(c==' ') c='+';
            cdp_eval("window.location='https://duckduckgo.com/?q=" + q + "'"); sleep(4);
            WEB_CONTEXT = cdp_eval("document.body.innerText"); printf("[MYTHOS] Search cached\n"); continue;
        }
        if(input.substr(0,5)=="/eval" && web){
            printf("[MYTHOS] %s\n", cdp_eval(input.substr(6)).c_str()); continue;
        }
        if(input.substr(0,8)=="/publish"){
            auto p=split(input.substr(9),'|'); if(p.size()>=2) publish_to_v14(p[0],p[1],p.size()>2?p[2]:"");
            continue;
        }
        printf("[MYTHOS] %s\n", local_infer(input).c_str());
    }
    return 0;
}
