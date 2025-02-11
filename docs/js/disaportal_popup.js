
alert("本サイトは、国土地理院のサイトではありませんのでご注意ください。")


/************************************************************************
 ポップアップ凡例用テーブル
 ************************************************************************/
      // title,description,r,g,b,優先度
const disasterPopupTable = {
  shinsui: [
      ["浸水深","0.3m 未満"                               ,255,255,179, 11],
      ["浸水深","0.5m 未満"                               ,247,245,169, 12],
      ["浸水深","0.5m ～ 1.0m"                            ,248,225,166, 13],
      ["浸水深","0.5m ～ 3.0m"                            ,255,216,192, 14],
      ["浸水深","3.0m ～ 5.0m"                            ,255,183,183, 15],
      ["浸水深","5.0m ～ 10.0m"                           ,255,145,145, 16],
      ["浸水深","10.0m ～ 20.0m"                          ,242,133,201, 17],
      ["浸水深","20.0m 以上"                              ,220,122,220, 18],
  ],
  keizoku: [
      ["浸水継続時間","12時間未満"                        ,160,210,255,  1],
      ["浸水継続時間","12時間 ～ 1日未満"                 ,  0, 65,255,  2],
      ["浸水継続時間","1日 ～ 3日未満"                    ,250,245,0  ,  3],
      ["浸水継続時間","3日 ～ 1週間未満"                  ,255,153,0  ,  4],
      ["浸水継続時間","1週間 ～ 2週間未満"                ,255, 40,0  ,  5],
      ["浸水継続時間","2週間以上"                         ,180, 0,104 ,  6],
      ["浸水継続時間","4週間以上"                         , 96, 0, 96 ,  7],
  ],
  hanran: [
      ["家屋倒壊等氾濫想定区域（氾濫流）","区域内"        ,255, 0,  0 , 21],
  ],
  kagan: [
      ["家屋倒壊等氾濫想定区域（河岸侵食）","区域内"      ,255, 0,  0 , 21],
  ],
  dosha: [
      ["急傾斜地の崩壊","土砂災害警戒区域（指定済）"      ,250,230, 0 , 21],
      ["急傾斜地の崩壊","土砂災害特別警戒区域（指定済）"  ,250,40,  0 , 22],
      ["急傾斜地の崩壊","土砂災害警戒区域（指定予定）"    ,251,235, 51, 21],
      ["急傾斜地の崩壊","土砂災害特別警戒区域（指定予定）",251,83,  51, 22],
      ["土石流","土砂災害警戒区域（指定済）"              ,230,200, 50, 21],
      ["土石流","土砂災害特別警戒区域（指定済）"          ,165,0,   33, 22],
      ["土石流","土砂災害警戒区域（指定予定）"            ,235,211, 91, 21],
      ["土石流","土砂災害特別警戒区域（指定予定） "       ,183,51,  77, 22],
      ["地すべり","土砂災害警戒区域（指定済）"            ,255,153, 0 , 21],
      ["地すべり","土砂災害特別警戒区域（指定済）"        ,180,0,   40, 22],
      ["地すべり","土砂災害警戒区域（指定予定）"          ,255,173, 51, 21],
      ["地すべり","土砂災害特別警戒区域（指定予定） "     ,195,51,  83, 22],
  ]
};

const DISAPORTAL = {
  GLOBAL: {
    clickPointMarker: {},
    isRiskMatometeMode: false,
    riskGetRange: 50, // 256 以下
    riskGetZoom: 17,
  },
  CONGFIG: {
    popupTargetLayers: [
      "01_flood_l2_shinsuishin_data",
      "01_flood_l1_shinsuishin_newlegend_data",
      "01_flood_l2_keizoku_data",
      "01_flood_l2_kaokutoukai_hanran_data",
      "01_flood_l2_kaokutoukai_kagan_data",
      "02_naisui_data",
      "03_hightide_l2_shinsuishin_data",
      "04_tsunami_newlegend_data",
      "05_dosekiryukeikaikuiki",
      "05_kyukeishakeikaikuiki",
      "05_jisuberikeikaikuiki",
      //"05_nadarekikenkasyo",
    ],
    legend: {
      "01_flood_l2_shinsuishin_data": disasterPopupTable.shinsui,
      "01_flood_l1_shinsuishin_newlegend_data": disasterPopupTable.shinsui,
      "01_flood_l2_keizoku_data": disasterPopupTable.keizoku,
      "01_flood_l2_kaokutoukai_hanran_data": disasterPopupTable.hanran,
      "01_flood_l2_kaokutoukai_kagan_data": disasterPopupTable.kagan,
      "02_naisui_data": disasterPopupTable.shinsui,
      "03_hightide_l2_shinsuishin_data": disasterPopupTable.shinsui,
      "04_tsunami_newlegend_data": disasterPopupTable.shinsui,
      "05_dosekiryukeikaikuiki": disasterPopupTable.dosha,
      "05_kyukeishakeikaikuiki": disasterPopupTable.dosha,
      "05_jisuberikeikaikuiki": disasterPopupTable.dosha,
      //"05_nadarekikenkasyo": [],
    }
  }
}

const getCategoryFromLayerId = (layerId) => {
  const p = layerId.substring(0, 2);
  let category = "";
  if(p == "01") category = "洪水";
  if(p == "02") category = "内水";
  if(p == "03") category = "高潮";
  if(p == "04") category = "津波";
  if(p == "05") category = "土砂";
  return category;
}

const disaportal = () => {
  
  console.log(GSI);
  const gsimaps = GSI.GLOBALS.gsimaps;
  console.log(gsimaps);
  const map = gsimaps._mainMap._map;
  console.log(map);
  
  // クリック時イベント設定
  map.on('click', (e) => {
    getRisk(e);
  });
  
  const queryString = window.location.search.substring(1);
  const queryParams = new URLSearchParams(queryString);
  
  console.log(queryParams);
  
  // クエリパラメータを利用した初回表示時のイベント
  if(queryParams.get("rkm") == "1"){
    gsimaps._onMenuItemClick({item:{id:'riskmatomete'}});
    setTimeout(() => {
      const c = { latlng: map.getCenter() };
      console.log(c);
      getRisk(c);
    }, 1);
  }
  
  // 住所関連時のイベント
  if(queryParams.has("q")){
    gsimaps._onMenuItemClick({item:{id:'riskmatomete'}});
    
    const q = document.getElementById("query");
    q.value = queryParams.get("q");
    
    const form = document.getElementById("search_f");
    const evSubmit = new Event('submit');
    form.dispatchEvent(evSubmit);
    
    // 変更の監視
    const targetNode = document.querySelector(".searchresultdialog_ul");
    const config = { attributes: true, childList: true, subtree: true };
    const callback = (mutationList, observer) => {
      
      console.log("住所検索結果リストの変更を検知");
      
      const aqs = document.querySelectorAll(".searchresultdialog_ul li a");
      const addrs = gsimaps._searchDialog.chimeiResult
      for(let i=0; i<aqs.length; i++){
        //console.log(aqs[i]);
        
        const func = () => {
          if(!DISAPORTAL.GLOBAL.isRiskMatometeMode) return;
          
          const title = aqs[i].querySelector("div.title").innerText;
          const coords = addrs[i].geometry.coordinates;
          const lnglat = {latlng: { lng: coords[0], lat: coords[1] }};
          console.log("ADDRTEST:クリックイベント");
          
          const tmpMarkerLatLng = DISAPORTAL.GLOBAL.clickPointMarker._latlng;
          //console.log([tmpMarkerLatLng,lnglat]);
          
          /***
           * 目的の変更以外の変更も検知して関数が追加されてしまうため、
           * 既存のマーカーを見て、場所の変化があるのか確認する
          ***/
          
          if(tmpMarkerLatLng 
            && Math.abs(tmpMarkerLatLng.lng - lnglat.latlng.lng) < 0.0001
            && Math.abs(tmpMarkerLatLng.lat - lnglat.latlng.lat) < 0.0001
          ){
            console.log("ADDRTEST:リスク取得をスキップ")
            return;
          }
          
          getRisk(lnglat, title);
          
        }
        
        aqs[i].addEventListener('click', func);
      }
      
      const evClick = new Event('click');
      aqs[0].dispatchEvent(evClick);
      
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
    
  }
  
  const getRisk = (e, title="") => {
    // 作図中は反応させない
    console.log(gsimaps);
    if(gsimaps._sakuzuDialog && gsimaps._sakuzuDialog.getVisible()) {
      //alert('作図中は断面図を作成できません');
      return;
    }
    if(gsimaps._crossSectionViewDialog && gsimaps._crossSectionViewDialog.isMinimized()) {
      //alert('断面図最小化中は作図出来ません');
      return;
    }
    
    // 既存のポップアップ用アイコンは削除
    if(DISAPORTAL.GLOBAL.clickPointMarker){
      map.removeLayer(DISAPORTAL.GLOBAL.clickPointMarker);
    }
    
    // クリック地点の経緯度
    //console.log(e);
    const lng = e.latlng.lng;
    const lat = e.latlng.lat;
    
    /*
     * GSI.GLOBALS.gsimaps._layersJSON.visibleLayersHash だと変更を検出できなかったので、
     * URL のハッシュパラメータから取得することにする。
     * パラメータのうち、レイヤリスト ls と表示非表示 disp が必要。
     * 上手くいかなかった例：const layers = GSI.GLOBALS.gsimaps._layersJSON.visibleLayersHash;
     */
    
    const _url = new URL(window.location.href);
    const _hash = _url.hash;
    const _ls = _hash.split("&").filter( x => x.match("ls="));
    const layers = _ls[0].replace("ls=", "").split("%7C").reverse(); // 表示順に合わせる
    const _disp = _hash.split("&").filter( x => x.match("disp="));
    const disp = _disp[0].replace("disp=", "").split("").reverse(); // 表示順に合わせる
    
    //console.log(_ls);
    //console.log(layers);
    //console.log(disp);
    
    // ポップアップの取得対象の設定
    const px = DISAPORTAL.GLOBAL.riskGetRange;
    const zl = DISAPORTAL.GLOBAL.riskGetZoom;
          
    if(!DISAPORTAL.GLOBAL.isRiskMatometeMode){
      // 通常モード
      // １番上に表示されている災害リスク情報のみを表示
      for(let i=0; i < layers.length; i++){
        const layerId = layers[i];
        const isVisible = +disp[i];
        if(isVisible && DISAPORTAL.CONGFIG.popupTargetLayers.includes(layerId)){
          drawTileImages(lat, lng, zl, px, layerId, "").then( res =>{
          
            console.log(res);

            // ポップアップ処理
            const layerId = res.layerId;
            const canvas = res.canvas;
            const info = res.info
            
            let html = "<table>";
            info.sort((a, b) => b.rank - a.rank).forEach( risk => {
              const bgColor = risk.rank ? `rgb(${risk.rgb[0]},${risk.rgb[1]},${risk.rgb[2]})` : `rgb(200,200,200)`;
              const ratio = Math.floor(risk.count/(canvas.width * canvas.height) * 100);
              const s = `<tr style="background-color:${bgColor}">`
                      + `<td>${risk.msg}</td><td>${risk.count}</td><td>${ratio}%</td></tr>`;
              html += s;
            });
            
            
            html += "</table>" + `<div>※読込 ZL：${zl}, バッファ：${px} px,<br>
                                  ピクセル総数：${canvas.width * canvas.height}</div>`;
                                  
            const div = document.createElement('div');
            div.innerHTML = html;
            
            const category = getCategoryFromLayerId(layerId);
            const title = document.createElement('div');
            title.innerHTML = "<div>" + category + " " + layerId + "</div>";
            
            const parent = document.createElement('div');
            parent.appendChild(title);
            canvas.style.border = `2px solid rgb(150,150,150)` ;
            parent.appendChild(canvas);
            parent.appendChild(div);
            
            DISAPORTAL.GLOBAL.clickPointMarker = L.marker([lat, lng])
              .addTo(map)
              .bindPopup(parent)
              .openPopup();
          
          });
          
          // 上に表示されているレイヤのみ表示するため、ヒットがあれば後続のレイヤは確認せず終了
          break;
          
        }
      }
      
    }else{
    
      // リスクをまとめて検索モード
      // DISAPORTAL.CONGFIG.popupTargetLayersをすべてチェック
      console.log("リスクをまとめて検索");
      
      const pmset = [];
      
      DISAPORTAL.CONGFIG.popupTargetLayers.forEach( layerId => {
        console.log(layerId);
        const pm = drawTileImages(lat, lng, zl, px, layerId, "");
        pmset.push(pm);
      });
      
      // 比較用に標準地図も読む
      const pmStd = drawTileImages(lat, lng, zl, px, "std", "https://cyberjapandata.gsi.go.jp/xyz");
      pmset.push(pmStd);
      
      Promise.all(pmset).then((values) => {
        console.log(values);
        
        // 詳細表示用
        let list = "";
        const imagesDiv = document.createElement('div');
        // 概要表示用
        const riskInfo = {
          shinsuiArray: []
        };
        
        values.forEach( res => {
          // ポップアップ処理
          const layerId = res.layerId;
          const canvas = res.canvas;
          const info = res.info
          
          // canvas の共通設定
          canvas.style.width = "64px";
          canvas.style.height = "64px";
          canvas.style["margin-left"] = "4px";
          canvas.title = layerId;
          
          // std の場合、canvas 追加のみで終了
          if(layerId == "std"){
            canvas.style.border = "2px solid #AAA";
            imagesDiv.appendChild(canvas);
            return;
          }
          
          // 災害リスク情報は、ヒットがあれば canvas と説明文を追加
          const mostDangerousRiskInfo = info.sort((a, b) => b.rank - a.rank)[0];
          console.log(mostDangerousRiskInfo);
          if(!mostDangerousRiskInfo.rank) return;
          
          // レイヤの追加用関数
          const addLayer = () => {
            const _tmpUrl = new URL(window.location.href);
            console.log(_tmpUrl);
            const _tmpHash = _tmpUrl.hash;
            const _params = _tmpHash.split("&");
            
            // パラメータをデコード
            const paramObj = {};
            for(let i=0; i<_params.length; i++){
              const [key, cont] = _params[i].split("=");
              if(key == "ls") {
                paramObj[key] = cont.split("%7C");
              }else if(key == "disp"){ 
                paramObj[key] = cont.split("");
              }else if(key == "blend"){ 
                paramObj[key] = cont.split("");
              }else{ 
                paramObj[key] = cont;
              }
            }
            
            // blend パラメータは存在しないことがあるので前処理
            // なお、１番下のレイヤの乗算処理は効かない
            if(!paramObj.blend){
              const _tmpBlend = "0".repeat(paramObj.ls.length - 1);
              paramObj.blend = _tmpBlend.split("");
              _params.push("blend=" + _tmpBlend);
            }
            
            // 既存のレイヤをパラメータから削除
            let tmpLayerOrder = -1;
            const tmpLayerLength = paramObj.ls.length;
            for(let i=0; i<tmpLayerLength; i++){
              if(paramObj.ls[i] == layerId){
                console.log(i);
                paramObj.ls.splice(i, 1);
                paramObj.disp.splice(i, 1);
                paramObj.blend.splice(i - 1, 1); 
                tmpLayerOrder = i;
              }
            }
            
            // 新たに最上位に目的のレイヤを追加
            // ※もともと最上位の場合は削除する
            if(tmpLayerOrder < tmpLayerLength - 1){
              paramObj.ls.push(layerId);
              paramObj.disp.push("1");
              paramObj.blend.push("0");
            }
            
            // 新たな ls, disp, blend パラメータの生成
            const newLs = "ls=" + paramObj.ls.join("%7C");
            const newDisp = "disp=" + paramObj.disp.join("");
            const newBlend = "blend=" + paramObj.blend.join("");
            
            // ハッシュ部の再生成
            const _newParams = [];
            
            for(let i=0; i<_params.length; i++){
              let param = "";
              if(_params[i].match(/^ls=/)){
                param = newLs;
              }else if(_params[i].match(/^disp=/)){
                param = newDisp;
              }else if(_params[i].match(/^blend=/)){
                param = newBlend;
              }else{
                param = _params[i];
              }
              _newParams.push(param);
            }
            
            const _newHash = _newParams.join("&");
            
            // URL の再生成と設定
            const _newUrl = _tmpUrl.origin + _tmpUrl.pathname + _tmpUrl.search + _newHash;
            console.log(_newHash);
            console.log("新しく " + _newUrl + " へ遷移");
            window.location.replace(_newUrl);
          }
          
          // canvas の追加設定
          canvas.style.border = `2px solid rgb(${mostDangerousRiskInfo.rgb[0]},${mostDangerousRiskInfo.rgb[1]},${mostDangerousRiskInfo.rgb[2]})` ;
          canvas.style.cursor = "pointer";
          canvas.addEventListener('click', addLayer);
          imagesDiv.appendChild(canvas);
          
          // 災害種別を設定
          console.log(layerId);
          const category = getCategoryFromLayerId(layerId);
          if(!category) return;
          
          // 詳細作成用
          list += "<li>" + category + " " + mostDangerousRiskInfo.span + "</li>";
          
          // 概要作成用 
          if(layerId.match("keizoku")){
            // 浸水継続時間は概要には追加しない
          }else if(layerId.match("kaokutoukai")){
            riskInfo.kaokutoukai = true;
          }else if(category == "洪水" || category == "内水" || category == "高潮"){
            if(!riskInfo.shinsui || riskInfo.shinsui.rank < mostDangerousRiskInfo.rank){
              riskInfo.shinsui = {
                rank:mostDangerousRiskInfo.rank,
                text:mostDangerousRiskInfo.description,
                rgb:mostDangerousRiskInfo.rgb
              }
            }
            if(!riskInfo.shinsuiArray.includes(category)){
              riskInfo.shinsuiArray.push(category);
            }
          }else if(category == "津波"){
            if(!riskInfo.tsunami || riskInfo.tsunami.rank < mostDangerousRiskInfo.rank){
              riskInfo.tsunami = {
                rank:mostDangerousRiskInfo.rank,
                text:mostDangerousRiskInfo.description
              }
            }
          }else if(category == "土砂"){
            riskInfo.dosha = true;
          }
          
        });
        
        // 詳細表示用（detail）
        if(!list) list = "<li>リスク情報を検索できませんでした。</li>";
        let html = "<div>";
        html += "<ol>" + list + "</ol>";
        html += "<strong>※リスクがあっても検索・表示できない場合があります。実際のリスクは、自治体のハザードマップ等で確認をお願いします。</strong>"
        html += "</div>";
        
        const desc = document.createElement('div');
        desc.innerHTML = html;
        
        const detailTitle = document.createElement('div');
        detailTitle.innerHTML = "<div style='background-color:#00316A;color:#FFF;padding:2px;border-radius:4px 4px 0px 0px;'>"
              + "リスクをまとめて表示（詳細）" + (title ? "<br>" + title : "")
              + "</div>";
        
        const imageGuide = document.createElement('div');
        imageGuide.innerHTML = "上記画像をクリックすると該当レイヤを追加します。もし該当レイヤが既に最上位に表示されている場合、削除します。";
        imageGuide.style["font-size"] = "0.75em";
        
        const detail = document.createElement('div');
        detail.id = "disasiterPopupDetail";
        
        detail.appendChild(detailTitle); // タイトル
        detail.appendChild(document.createElement('hr'));
        detail.appendChild(imagesDiv); // 取得ピクセルの画像
        detail.appendChild(imageGuide); // 画像の説明
        detail.appendChild(document.createElement('hr'));
        detail.appendChild(desc); // 取得した情報の内容

        // 概要表示用（summary）
        let html2 = "";
        if(riskInfo.shinsui){
          const [r, g, b] = riskInfo.shinsui.rgb;
          html2 += `<div style="background-color:rgb(${r},${g},${b});margin:2px;">`
               + "ここの周囲では、最悪の場合、"
               + "<span style='font-weight:bold;'>" + riskInfo.shinsuiArray.join("、") + "</span>"
               + "による浸水が発生して、"
               + "その深さが" 
               + "<span style='font-weight:bold;'>" + riskInfo.shinsui.text + "</span>"
               + "になることが想定されています。"
               + "</div>"
        }
        if(riskInfo.kaokutoukai){
          html2 += `<div style="background-color:rgb(255,100,100);margin:2px;">`
               + "また、ここの周囲は、河川からあふれた水の流れにより、"
               + "木造住宅などが倒壊する危険性のある場所です。"
               + "</div>"
        }
        if(riskInfo.dosha){
          html2 += `<div style="background-color:rgb(255,100,100);margin:2px;">`
               + "ここの周囲は、<span style='font-weight:bold;'>土砂災害</span>が発生した場合、"
               + "住民等の生命または身体に危険が生ずるおそれがある場所です。"
               + "</div>"
        }
        if(riskInfo.tsunami){
          html2 += `<div style="background-color:rgb(255,100,100);margin:2px;">`
               + "ここの周囲では、最悪の場合、"
               + "<span style='font-weight:bold;'>" + "津波" + "</span>"
               + "による浸水が発生して、"
               + "その深さが" 
               + "<span style='font-weight:bold;'>" + riskInfo.tsunami.text + "</span>"
               + "になることが想定されています。"
               + "</div>"
        }
        if(html2 == ""){
          html2 += `<div style="margin:2px;">`
               + "ここの周囲は、"
               + "洪水・内水、高潮、土砂災害、津波による被害の危険性が想定されていない"
               + "又は<span style='font-weight:bold;'>現時点では災害リスクに関するデータが未整備</span>の場所です"
               + "</div>"
        }
        
        html2 = "<div id='disasterPopupSummary'>"
              + "<div style='background-color:#00316A;color:#FFF;padding:2px;border-radius:4px 4px 0px 0px;'>"
              + "リスクをまとめて表示（概要）" + (title ? "<br>" + title : "")
              + "</div>"
              + html2
              + "</div>";
        html2 += "<div><strong>※リスクがあっても検索・表示できない場合があります。実際のリスクは、自治体のハザードマップ等で確認をお願いします。</strong></div>";

        const summary = document.createElement('div');
        summary.innerHTML = html2;
        
        // タブ用（tabs）
        const tabs = document.createElement('div');
        
        const activeBgColor = "#FFFFFF"; 
        const activeTextColor = "#000000";
        const inactiveBgColor = "#00316A";
        const inactiveTextColor = "#FFFFFF";
          // "#0055AD" はホバー色なのでいったん採用見送り
        
        const btn1 = document.createElement('a');
        btn1.href = "javascript:void(0);";
        btn1.innerText = "詳細";
        btn1.style["background-color"] = inactiveBgColor;
        btn1.style.color = inactiveTextColor;
        btn1.style.display = "inline-block";
        btn1.style.cursor = "pointer";
        btn1.style["text-decoration"] = "none";
        btn1.style.padding = "4px";
        btn1.style.margin = "0px 0px 4px 4px";
        btn1.style["border-radius"] = "0px 0px 2px 2px";
        
        const btn2 = document.createElement('a');
        btn2.href = "javascript:void(0);";
        btn2.innerText = "概要";
        btn2.style["background-color"] = activeBgColor;
        btn2.style.color = activeTextColor;
        btn2.style.display = "inline-block";
        btn2.style.cursor = "pointer";
        btn2.style["text-decoration"] = "none";
        btn2.style.padding = "4px";
        btn2.style.margin = "0px 0px 4px 4px";
        btn2.style["border-radius"] = "0px 0px 2px 2px";
        
        btn1.addEventListener('click', ()=>{
          btn2.style["background-color"] = inactiveBgColor;
          btn2.style.color = inactiveTextColor;
          summary.style.display = "none";
          btn1.style["background-color"] = activeBgColor;
          btn1.style.color = activeTextColor;
          detail.style.display = "block";
        });
        
        btn2.addEventListener('click', ()=>{
          btn1.style["background-color"] = inactiveBgColor;
          btn1.style.color = inactiveTextColor;
          detail.style.display = "none";
          btn2.style["background-color"] = activeBgColor;
          btn2.style.color = activeTextColor;
          summary.style.display = "block";
        });
        
        tabs.appendChild(btn2);
        tabs.appendChild(btn1);
        tabs.style["border-top"] = `4px solid ${activeBgColor}`;
        tabs.style["margin-top"] = "2px";
        tabs.style["background-color"] = inactiveBgColor;
        tabs.style["border-radius"] = "0px 0px 4px 4px";
        
        detail.style.display = "none"; // 最初は 詳細 は非表示
        
        const pop = document.createElement('div');
        pop.style.border = `3px solid ${inactiveBgColor}`;
        pop.style["border-radius"] = "8px";
        pop.style.padding = "1px";
        
        pop.appendChild(summary);
        pop.appendChild(detail);
        pop.appendChild(tabs);
        
        // ポップアップを地図に追加
        // 既存のポップアップ用アイコンは削除
        if(DISAPORTAL.GLOBAL.clickPointMarker){
          map.removeLayer(DISAPORTAL.GLOBAL.clickPointMarker);
        }
        DISAPORTAL.GLOBAL.clickPointMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(pop)
          .openPopup();
        
      }); // Promise.all おわり
      
    }
  } // getRisk() おわり

  /*************************************************/
  /*タイル読み込み関係設定                      */
  /*************************************************/

  //Reference: Slippy map tilenames
  //https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
  const lon2tile = (lon,zoom) => { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
  const lat2tile = (lat,zoom) => { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
  const lon2tiled = (lon,zoom) => { return ((lon+180)/360*Math.pow(2,zoom)); }
  const lat2tiled = (lat,zoom) => { return ((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)); }
  const tile2long = (x,z) => { return (x/Math.pow(2,z)*360-180); }
  const tile2lat  = (y,z) => {
    const n=Math.PI-2*Math.PI*y/Math.pow(2,z);
    return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
  }

  const getBboxGeojson = (lat, lng, zl, px) => {
    
    const dX = lon2tiled(lng, zl);
    const dY = lat2tiled(lat, zl);
    
    const X = Math.floor(dX);
    const Y = Math.floor(dY);
    const tx = Math.floor(256 * (dX - X));
    const ty = Math.floor(256 * (dY - Y));
    
    const e = tx - px;
    const w = tx + px;
    const n = ty - px;
    const s = ty + px;
    
    const lng_e = tile2long(dX - px/256, zl);
    const lng_w = tile2long(dX + px/256, zl);
    const lat_n = tile2lat(dY - px/256, zl);
    const lat_s = tile2lat(dY + px/256, zl);
    
    const geojson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [lng_e, lat_n],
                [lng_e, lat_s],
                [lng_w, lat_s],
                [lng_w, lat_n],
                [lng_e, lat_n]
              ]
            ]
          },
          "properties": {}
        }
      ]
    }
    
    return geojson;
    
  }

  const getTileList = (lat, lng, zl, px) => {
    
    const dX = lon2tiled(lng, zl);
    const dY = lat2tiled(lat, zl);
    
    if(px*2 > 255) console.log("サイズは256px以下にしてください")
    
    const X = Math.floor(dX);
    const Y = Math.floor(dY);
    const tx = Math.floor(256 * (dX - X));
    const ty = Math.floor(256 * (dY - Y));
    
    const e = tx - px;
    const w = tx + px;
    const n = ty - px;
    const s = ty + px;
    
    console.log(e, w, n, s);
    
    const eX = (e < 0)   ? X-1 : X;
    const wX = (w > 255) ? X+1 : X;
    const nY = (n < 0)   ? Y-1 : Y;
    const sY = (s > 255) ? Y+1 : Y;
    
    const ex = (e < 0)   ? 256 + e : e;
    const wx = (w > 255) ? w - 256 : w;
    const ny = (n < 0)   ? 256 + n : n;
    const sy = (s > 255) ? s - 256 : s;
    
    const ex2 = (eX == wX) ? wx : 255;
    const wx1 = (eX == wX) ? ex : 0;
    const ny2 = (nY == sY) ? sy : 255;
    const sy1 = (nY == sY) ? ny : 0;
    
    
    const tiles = [];
    tiles.push({X: eX, Y: nY, xRange: [ex, ex2], yRange: [ny, ny2], name: "ne", order: 1});
    if(eX != wX){
      tiles.push({X: wX, Y: nY, xRange: [wx1, wx], yRange: [ny, ny2], name: "nw", order: 2});
    }
    if(nY != sY){
      tiles.push({X: eX, Y: sY, xRange: [ex, ex2], yRange: [sy1, sy], name: "se", order: 3});
    }
    if(eX != wX && nY != sY){
      tiles.push({X: wX, Y: sY, xRange: [wx1, wx], yRange: [sy1, sy], name: "sw", order: 4});
    }
    
    return tiles
  }


  const infoFromColor = ( layerId, r, g, b ) => {
    
    let info = {
      title: "no-data",
      description: "該当なし",
      rank: 0
    };
    
    const legend = DISAPORTAL.CONGFIG.legend[layerId];
    if(!legend) return info; // std は legend 設定なし
    
    for(let i=0; i<legend.length; i++){
      const s = legend[i];
      if(r == +s[2] && g == +s[3] && b == +s[4]){
        info.title = s[0];
        info.description = s[1];
        info.rank = +s[5];
        break;
      }
    }
    
    return info;
    
  }

  const drawTileImages = (lat, lng, zl, px, ds, root="") => {
    
    const tiles = getTileList(lat, lng, zl, px);
    console.log(tiles);
    
    const title = document.createElement('div');
    title.innerText = ds;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // 画像の読み込み
    const tileId = ds;
    const imageSources = tiles.map( info => {
      // { src: 'image3.jpg', x: 400, y: 200 }
      const X = info.X;
      const Y = info.Y;
      const tilename = `${zl}-${X}-${Y}`;
      const urlRoot = root ? root : "https://disaportaldata.gsi.go.jp/raster";
      const url = `${urlRoot}/${tileId}/${zl}/${X}/${Y}.png`;
      
      
      return {
        src: url,
        ...info
      }
    });
    
    const imagesLoaded = [];
    const imageWidth = 256; // 仮定された画像の幅
    const imageHeight = 256; // 仮定された画像の高さ

    let imagesLoadedCount = 0;

    return new Promise((resolve, reject) => {
    
      // 画像の読み込みと描画
      imageSources.forEach((imageInfo) => {
        const img = new Image();
        img.onload = () => {
          imagesLoadedCount++;
          imagesLoaded.push({ image: img, ...imageInfo });

          if (imagesLoadedCount === imageSources.length) {
            const info = drawImages(context, imagesLoaded);
            resolve(info);
          }
        };
        img.onerror = (err) => {
          
          console.log(err);
          
          // 画像が見つからない場合、代替画像を追加
          const placeholderCanvas = document.createElement('canvas');
          placeholderCanvas.width = imageWidth;
          placeholderCanvas.height = imageHeight;
          const placeholderContext = placeholderCanvas.getContext('2d');
          placeholderContext.fillStyle = 'rgba(200, 200, 200, 1)';
          placeholderContext.fillRect(0, 0, imageWidth, imageHeight);
          img.src = placeholderCanvas.toDataURL();
        };
        img.crossOrigin = "Anonymous";
        img.src = imageInfo.src;
      });
      
    });

    // 画像を描画する関数
    function drawImages(ctx, imgs) {
      // キャンバスのサイズを計算
      let canvasWidth = 0;
      let canvasHeight = 0;
      imgs.forEach((imgInfo) => {
        //console.log(imgInfo);
        const width = imgInfo.xRange[1] - imgInfo.xRange[0] + 1;
        const height = imgInfo.yRange[1] - imgInfo.yRange[0] + 1;
        // 順番に応じて、次のタイルのために描画原点を設定          
        if(imgInfo.order == 1){
          canvasWidth += width;
          canvasHeight += height;
        }else if(imgInfo.order == 2){
          canvasWidth += width;
        }else if(imgInfo.order == 3){
          canvasHeight += height;
        }
      });
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      console.log(canvasWidth, canvasHeight);
      
      // 画像を描画
      let dox = 0;
      let doy = 0;
      
      imgs.sort((a,b)=>{
        return a.order - b.order;
      });
      
      imgs.forEach((imgInfo) => {
        console.log(imgInfo);
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        const sx = imgInfo.xRange[0] - 1;
        const sy = imgInfo.yRange[0] - 1;
        const sWidth = imgInfo.xRange[1] - imgInfo.xRange[0] + 1;
        const sHeight = imgInfo.yRange[1] - imgInfo.yRange[0] + 1;
        
        // 順番に応じて、次のタイルのために描画原点を設定
        let dx = 0;
        let dy = 0;
        if(imgInfo.order == 1){
           dox += sWidth - 1;
           doy += sHeight - 1; 
        }else if(imgInfo.order == 2){
           dx = dox;
        }else if(imgInfo.order == 3){
           dy = doy;
        }else if(imgInfo.order == 4){
           dx = dox;
           dy = doy;
        }
        
        ctx.drawImage(imgInfo.image, sx, sy, sWidth, sHeight, dx, dy, sWidth, sHeight)
        
      });
      
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const buf = data.data;
      console.log(data);
      
      const tmp = {};
      const ch = buf.length / ( canvas.width * canvas.height );
      for( let i = 0; i < buf.length / ch; i++ ){
        const [ r, g, b, a ] = [ buf[ i * ch ], buf[ i * ch + 1 ], buf[ i * ch + 2 ], buf[ i * ch + 3 ]  ];
        let info = infoFromColor( ds, r, g, b ); // 色を情報へ変換
        const dp = info.title + ":" + info.description;
        if(!dp) continue;
        if(!tmp[dp]){
          tmp[dp] = {};
          tmp[dp].count = 0;
          tmp[dp].description = info.description;
          tmp[dp].rank = info.rank;
          tmp[dp].msg = dp;
          tmp[dp].rgb = [r,g,b];
          tmp[dp].span = `<span style="background-color:rgb(${r},${g},${b});">${dp}</span>`;
        }
        tmp[dp].count += 1;
      }
      
      const res = {
        canvas: canvas,
        title: title,
        layerId: ds,
        info: []
      };
      
      const keys = Object.keys(tmp).sort().reverse();
      console.log(keys);
      keys.forEach( name => {
        res.info.push(tmp[name]);
      });
      
      return res;
      
    }
  };
}

/************************************************************************
 L.Class
 - GSI.RiskMatometeDialog
   リスク検索機能（まとめて検索）
 ************************************************************************/
GSI.RiskMatometeDialog = GSI.Dialog.extend({

  options: {
    title: "リスク検索",
    width: "380px",
    minimize: true
  },

  // 初期化
  initialize: function (dialogManager, map, options) {
    this.map = map;
    GSI.Dialog.prototype.initialize.call(this, dialogManager, options);
  },

  // 表示
  show: function () {
    GSI.Dialog.prototype.show.call(this);
    DISAPORTAL.GLOBAL.isRiskMatometeMode = true;
    this._check();
  },

  // 入力監視開始
  _startCheck: function () {
    this._clearCheck();
  },

  _nextCheck: function () {
    this._checkTimerId = setTimeout(L.bind(function () {
      this._check();
    }, this), 200);
  },

  // 変更があれば生成しなおし
  _check: function () {
    this._nextCheck();
  },

  // チェック終了
  _clearCheck: function () {
    if (this._checkTimerId)
      clearTimeout(this._checkTimerId);
    this._checkTimerId = null;
  },

  hide: function () {
    this._clearCheck();
    DISAPORTAL.GLOBAL.isRiskMatometeMode = false;
    GSI.Dialog.prototype.hide.call(this);
  },
  
  _cloceButtonClick: function () {
    this.fire("closeClick");
    this.hide();
  },
  
  createHeader: function () {
    this.title = $('<div>').html(this.options.title);
    return $('<div>').append(this.title);
  },

  _fireChange: function () {
    this.fire("change", {
    // 必要に応じて
    });
  },

  createContent: function () {
    this.frame = $('<div>').css({ "padding": "5px" }).addClass("gsi_riskmatomete_content");
    
    let html = "地図をクリックすると、その周囲の災害リスク情報をまとめて表示します。取得に時間がかかる場合があります。"
             + "<br><strong>※取得に失敗することや内部処理でエラーが生じていることがあります。必ず、自治体のハザードマップで確認をお願いします。</strong>"
    
    const div = $("<div>").addClass("msg_frame").html(html);
    
    this.frame.append(div);

    return this.frame;
  }
});


