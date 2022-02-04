import { Component, OnInit, AfterViewInit, Input, HostBinding, ElementRef } from '@angular/core';
import { Utils } from 'src/app/shared/utils/utils';
import * as _ from 'lodash';
import * as $ from 'jquery';


declare var naver: any;

@Component({
  selector: 'app-naver-map',
  templateUrl: './naver-map.component.html',
  styleUrls: ['./naver-map.component.scss']
})
export class NaverMapComponent implements OnInit, AfterViewInit {

  uniqueMapId = Utils.uuid();
  map;

  @Input() imgSize: any = {x: 32, y: 41};
  @Input() markerDataList: any;

  imgNone = "/assets/images/img-main-pin-none.png";
  imgOp = "/assets/images/img-main-pin-op.png";
  imgRep = "/assets/images/img-main-pin-rep.png";

  markerList = {};
  drawingManager;

  @HostBinding('style.width') public hostWidth = '100%';
  @HostBinding('style.height') public hostheight = '100%';

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // ngOnInit 에서는 div 가 생성되기도 전에 new naver.map 가 실행되어 오류 발생.
    this.createNaverMap();
    // this.createServiceAreaPolygon();
    this.markerEfficientDisplay();
    this.createMarkers();
  }

  createNaverMap() {
    this.map = new naver.maps.Map(this.uniqueMapId, {
      // 서울대
      center: new naver.maps.LatLng(37.46199892230759, 126.9540862548989),
      // 대구 그린모빌리티
      // center: new naver.maps.LatLng(35.650255, 128.402177),
      zoom: 11,
      maxZoom:18,
      minZoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.LARGE,
        position: naver.maps.Position.TOP_RIGHT
      },
      mapTypeControl: true,
    });
    //이게 왜 수정된게 적용이 안되나..

    naver.maps.Event.once(this.map, 'init_stylemap', () => {
      this.drawingManager = new naver.maps.drawing.DrawingManager({map: this.map});
    });

    naver.maps.Event.addListener(this.map, 'zoom_changed', (level) =>{
      console.log('zoom level',level);
    });



    // 예제
    this.addr2latLng("서울특별시 관악구 관악로 1").then(coords => {
      console.log("주소로 좌표 변환 -> ", coords);
    }).catch(err => {
      console.log(err);
    });

    // 예제
    this.latLng2Addr({lat: 37.46199892230759, lng: 126.9540862548989}).then(addr => {
      console.log("좌표로 주소 변환 -> ", addr);
    }).catch(err => {
      console.log(err);
    });
  }

  public createMarkers() {
    _.each(this.markerDataList, markerData => {
      let markerOptions = {
        position: new naver.maps.LatLng(markerData.latitude, markerData.longitude),
        map: this.map,
        icon: {
            url: markerData.icon,
            size: new naver.maps.Size(this.imgSize.x, this.imgSize.y),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(this.imgSize.x / 2, 0)
        }
      };

      let marker = new naver.maps.Marker(markerOptions);
      this.markerList[markerData.deviceId] = {
        marker: marker,
        markerData: markerData
      };

      let iwContent = '<div class="w100 h30 box-col-nwr flex-center-middle fs14">'+markerData.assetNumber+'</div>';
      let infowindow = new naver.maps.InfoWindow({
        content: iwContent
      });
      naver.maps.Event.addListener(marker, "click", e => {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(this.map, marker);
        }
      });

      // let overlayContent = '<div class="map-custom-overlay w100 fs14" >';
      // overlayContent += markerData.licenseNumber + "\n";
      // overlayContent += 'batt:' + ((markerData.batteryStatus) ? markerData.batteryStatus : '-') + '%';
      // overlayContent += '</div>';
      // let overlay = new CustomOverlay({
      //   content: overlayContent,
      //   position: marker.getPosition(),
      //   map: this.map
      // });
    });
  }

  clearMarker() {
    let marker;
    for (let key in this.markerList) {
      marker = this.markerList[key].marker;
      marker.setMap(null);
      delete this.markerList[key];
    }
  }

  drawMarker(markerDataList) {
    this.markerDataList = markerDataList;
    this.createMarkers();
  }

  /** 현재 보이는 맵 영역안에 표시가능한 marker 만 표시함.  */
  markerEfficientDisplay() {
    naver.maps.Event.addListener(this.map, 'idle', () => {
      this.updateMarkers();
    });

  }

  refreshMapSize() {
    setTimeout(() => {
      let w = this.el.nativeElement.offsetWidth;
      let h = this.el.nativeElement.offsetHeight;
      this.map.setSize(new naver.maps.Size(w, h));
    }, 100);
  }

  setCenter(lat: number, lon: number) {
    this.map.setCenter(new naver.maps.LatLng(lat, lon));
  }

  refreshMap() {
    this.map.refresh(true);
  }

  createServiceAreaPolygon() {
    let polygon = new naver.maps.Polygon({
      map: this.map,
      paths: [
        this.getPathsWorld(),
        this.getPathsSeoulUniversity()
      ],
      fillColor: '#c3e4fa',
      fillOpacity: 0.7,
      strokeColor: '#b5daf3',
      strokeOpacity: 0.5,
      strokeWeight: 2
    });
    let polygonSeoulUniversity = new naver.maps.Polygon({
      map: this.map,
      paths: [
        this.getPathsSeoulUniversity()
      ],
      fillColor: '#c3e4fa',
      fillOpacity: 0,
      strokeColor: '#b5daf3',
      strokeOpacity: 0,
      strokeWeight: 2
    });

    let test1 = new naver.maps.LatLng(37.48540651009798, 126.90143896811797);
    console.log("# 특정좌표 서울대학포함여부 [구로디지털단지역] -> ", polygonSeoulUniversity.getBounds().hasLatLng(test1));

    let test2 = new naver.maps.LatLng(37.449490118530754, 126.9588630721403);
    console.log("# 특정좌표 서울대학포함여부 [서울대 근처 관악산] -> ", polygonSeoulUniversity.getBounds().hasLatLng(test2));

    let test3 = new naver.maps.LatLng(37.46266923446696, 126.95172344773316);
    console.log("# 특정좌표 서울대학포함여부 [서울대 법과대학] -> ", polygonSeoulUniversity.getBounds().hasLatLng(test3));

    let test4 = new naver.maps.LatLng(37.4449515598227, 126.96700204007146);
    console.log("# 특정좌표 서울대학포함여부 [관악산 중앙] -> ", polygonSeoulUniversity.getBounds().hasLatLng(test4));
  }

  addr2latLng(addr) {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode({ query: addr }, (status, result) => {
        if (status === naver.maps.Service.Status.ERROR) {
          reject(status);
        } else {
          let latLng = result.v2.addresses[0];
          let coords = { lat: latLng.y, lng: latLng.x };
          resolve(coords);
        }
      });
    });
  }

  latLng2Addr(coords) {
    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode({ coords: new naver.maps.LatLng(coords.lat, coords.lng) }, (status, result) => {
        if (status === naver.maps.Service.Status.ERROR) {
          reject(status);
        } else {
          resolve(result.v2.address.jibunAddress);
        }
      });
    });
  }

  updateMarkers() {
    let mapBounds = this.map.getBounds();
    let marker, position;

    for (let key in this.markerList) {
      marker = this.markerList[key].marker;
      position = marker.getPosition();

      if (mapBounds.hasLatLng(position)) {
          this.showMarker(marker);
      } else {
          this.hideMarker(marker);
      }
    }
  }

  showMarker(marker) {
    if (marker.getMap()) return;
    marker.setMap(this.map);
  }

  hideMarker(marker) {
    if (!marker.getMap()) return;
    marker.setMap(null);
  }

  getPathsWorld() {
    return [
      new naver.maps.LatLng(47.88050652688797, 101.69384645398546),
      new naver.maps.LatLng(23.603326012970477, 108.91840690817246),
      new naver.maps.LatLng(23.584096235626088, 147.437682009831),
      new naver.maps.LatLng(47.37242916782019, 154.35849116034595)
    ];
  }

  getPathsSeoulUniversity() {
    return [
      new naver.maps.LatLng(37.46985051687125, 126.95227274626178),
      new naver.maps.LatLng(37.46889525303324, 126.95179857409681),
      new naver.maps.LatLng(37.46795780143231, 126.95082702060873),
      new naver.maps.LatLng(37.467308511114815, 126.94949356979635),
      new naver.maps.LatLng(37.46689360694067, 126.94847649142584),
      new naver.maps.LatLng(37.466929439413825, 126.94800169977935),
      new naver.maps.LatLng(37.46714550223352, 126.94759460577096),
      new naver.maps.LatLng(37.4669652197292, 126.94741386788849),
      new naver.maps.LatLng(37.46548786169825, 126.94809312827677),
      new naver.maps.LatLng(37.46473107188641, 126.9482292952355),
      new naver.maps.LatLng(37.46332553390657, 126.94832069183099),
      new naver.maps.LatLng(37.46255084133157, 126.94872814447777),
      new naver.maps.LatLng(37.46175801971777, 126.94888693061077),
      new naver.maps.LatLng(37.460947079858606, 126.94881966413683),
      new naver.maps.LatLng(37.459540876035334, 126.9473964615053),
      new naver.maps.LatLng(37.458712015329574, 126.94755528046232),
      new naver.maps.LatLng(37.458189518421314, 126.9477590932544),
      new naver.maps.LatLng(37.45736053717615, 126.94764664452777),
      new naver.maps.LatLng(37.45597320728847, 126.94816751869813),
      new naver.maps.LatLng(37.45512665832079, 126.94909488338759),
      new naver.maps.LatLng(37.454351942635064, 126.94945707514731),
      new naver.maps.LatLng(37.45343289021345, 126.94941248579431),
      new naver.maps.LatLng(37.45235171330858, 126.94950362820154),
      new naver.maps.LatLng(37.451576716114594, 126.9492103058445),
      new naver.maps.LatLng(37.45063971085224, 126.9493239546292),
      new naver.maps.LatLng(37.45004488641477, 126.94896270992744),
      new naver.maps.LatLng(37.44844097471451, 126.94871517327809),
      new naver.maps.LatLng(37.44759389396576, 126.94842192376562),
      new naver.maps.LatLng(37.44714342648194, 126.9485126410204),
      new naver.maps.LatLng(37.446404810648204, 126.94901038629851),
      new naver.maps.LatLng(37.44606303104538, 126.9504345237639),
      new naver.maps.LatLng(37.44599128834081, 126.95124823061234),
      new naver.maps.LatLng(37.446388231643944, 126.95246846877643),
      new naver.maps.LatLng(37.447559892034434, 126.95332660827957),
      new naver.maps.LatLng(37.44849698202528, 126.95341643573265),
      new naver.maps.LatLng(37.44939797783058, 126.95337067168211),
      new naver.maps.LatLng(37.45305671408997, 126.95497326883608),
      new naver.maps.LatLng(37.45361574212379, 126.95603531926815),
      new naver.maps.LatLng(37.45480531285895, 126.95666754353134),
      new naver.maps.LatLng(37.45604891621878, 126.95723194304378),
      new naver.maps.LatLng(37.45747267059784, 126.95766062933966),
      new naver.maps.LatLng(37.45819360948558, 126.95802190810763),
      new naver.maps.LatLng(37.458932455555505, 126.95806670620787),
      new naver.maps.LatLng(37.459653503936934, 126.95874447653667),
      new naver.maps.LatLng(37.460518741276225, 126.95951260606489),
      new naver.maps.LatLng(37.4611675085058, 126.95962528737533),
      new naver.maps.LatLng(37.462140585754724, 126.95957955113809),
      new naver.maps.LatLng(37.46266321882836, 126.9597149098293),
      new naver.maps.LatLng(37.463330204213364, 126.9604153650198),
      new naver.maps.LatLng(37.46417729808238, 126.96084445384845),
      new naver.maps.LatLng(37.46518652777205, 126.96113782413467),
      new naver.maps.LatLng(37.46579930429153, 126.9614087983428),
      new naver.maps.LatLng(37.46709669357862, 126.96120465939572),
      new naver.maps.LatLng(37.468285719948256, 126.96027710200394),
      new naver.maps.LatLng(37.46819597129183, 126.96133974135266),
      new naver.maps.LatLng(37.468448394062364, 126.96176917121812),
      new naver.maps.LatLng(37.468772610765484, 126.96131683588412),
      new naver.maps.LatLng(37.46918704603067, 126.96122618778466),
      new naver.maps.LatLng(37.46951118534312, 126.96054775835783),
      new naver.maps.LatLng(37.46983551134398, 126.96043454375206),
      new naver.maps.LatLng(37.47035769012439, 126.95923599214191),
      new naver.maps.LatLng(37.47050154431832, 126.95835416178807),
      new naver.maps.LatLng(37.46860934228701, 126.95812912689144),
      new naver.maps.LatLng(37.46859119334385, 126.95776740171368),
      new naver.maps.LatLng(37.4688434924814, 126.95781247684256),
      new naver.maps.LatLng(37.46884330569007, 126.95729248070784),
      new naver.maps.LatLng(37.468644902536454, 126.95679520718598),
      new naver.maps.LatLng(37.468932026268625, 126.95362984372295)
    ];
  }

}

export class CustomOverlay extends naver.maps.OverlayView {

  constructor(options: any){
    super();
    this._element = $(options.content);
    this._position = options.position;
    this.setMap(options.map);
    this.draw();
  }

  onAdd() {
    let overlayLayer = this.getPanes().overlayLayer;
    this._element.appendTo(overlayLayer);
  }
  onRemove() {
    this._element.remove();
    this._element.off();
  }
  draw() {
    if (!this.getMap()) {
      return;
    }
    let projection = this.getProjection();
    let pixelPosition = projection.fromCoordToOffset(this._position);

    this._element.css('left', pixelPosition.x - 50);
    this._element.css('top', pixelPosition.y - 32);
  }
}
