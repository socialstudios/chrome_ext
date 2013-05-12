/*
  Yourshow - A personal daily TV show starring you and Your Friends!
  Go to the app now: http://bit.ly/Yv5U9Z.

  Social media platforms have yet to deliver a TV experience that viewers want to watch, 
  so we at Social Studios created Your Show: a Facebook app that quickly identifies newsfeed posts 
  from your close friends and favorite pages and automagically turns them into A personal daily chic TV show 
  starring you and Your Friends! Your Show is the first of its kind, 
  so tune in to a fun daily TV show hosted by Noa Tishby, 
  well-known actress and Hollywood producer.
*/

var CREATED_NEW_SHOW_INTERVAL = 6; //create new show every x hours
var storage = chrome.storage.local;

chrome.browserAction.onClicked.addListener(function() {
  //clear badge.
  chrome.browserAction.setBadgeText({"text":""});
  //save this event timestamp
  setLatestShowTs();
  //open yourshow app in a new tab.
  chrome.tabs.create({'url': "https://apps.facebook.com/yourshow/?ref=chrome_ext"});
});

function setLatestShowTs(){
  var ts = getCurrentTs();
  saveLatestShowTs(ts);
}

function saveLatestShowTs(showTs) {
  if (!showTs || !storage) {
    console.log('Error: No value specified');
    return;
  }
  // Save show timestamp using the Chrome extension storage API.
  storage.set({"latest_show_ts": showTs}, function() {
    console.log('Watching yourshow, Latest show timestamp is saved - ' + showTs);
  });
}

function checkLatestShowTimestamp(){
  console.log("checkLatestShowTimestamp");
  if (!storage){
    console.log("no local storage");
    return;
  }
  storage.get("latest_show_ts", function(data){
    if (data["latest_show_ts"]){
      var d = getCurrentTs();
      var diff = d - data["latest_show_ts"];
      var showsHoursDiff = 3600 * CREATED_NEW_SHOW_INTERVAL;
      if (diff > showsHoursDiff){
        chrome.browserAction.setBadgeText({"text":"1"});
      }else{
        console.log("time left till next notification: " + (showsHoursDiff-diff) + " seconds");
      }
    }else{
      console.log("no data");
      chrome.browserAction.setBadgeText({"text":"1"});
    }
  });
}

function getCurrentTs(){
  //return unix time stamp in seconds.
  ts = new Date().getTime(); 
  return parseInt(ts/ 1000);
}

checkLatestShowTimestamp();
