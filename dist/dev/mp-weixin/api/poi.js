"use strict";
require("../common/vendor.js");
const mock_poi = require("../mock/poi.js");
function getPoiList(params) {
  return Promise.resolve({ list: mock_poi.poiList, total: mock_poi.poiList.length });
}
function getPoiDetail(id) {
  const poi = mock_poi.getPoiById(id);
  return Promise.resolve(poi || null);
}
function getHotPoi(limit = 10) {
  return Promise.resolve(mock_poi.getHotPoiList(limit));
}
exports.getHotPoi = getHotPoi;
exports.getPoiDetail = getPoiDetail;
exports.getPoiList = getPoiList;
