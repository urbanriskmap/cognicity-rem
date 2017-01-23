/**
 * Generate a table based on the provided reports
 *@file JavaScript to display confirmed reports within map (PetaJakarta.org) via map.js
 *@copyright (c) Tomas Holderness & SMART Infrastructure Facility January 2014
 *@module reports
 *
 * @param {object} reports - a GeoJSON object
 */
export function loadTable(reports) {
	var rows, thead;

	// clear exiting modal
	$("#reportsModal .modal-body").empty();
	rows = "";

	var map = this.map
	var report_index = this.reportsLayerFeatureMap;

	window.centreMapOnPopup = function(pkey){
		let report = report_index[pkey];
		map.setView(report._latlng, 15);
		report.fireEvent('click');
	}

	for (var i=0;i<reports.features.length;i++) {
		//TODO - additional properties (flood height)
		var report = reports.features[i].properties;
		var reportGeo = reports.features[i].geometry;

		//Catch those reports that have no text, only a title
		var text = report.text;
		if (report.text.length < 1){
			text += report.title;
		}

		rows +='<tr>';
			rows += '<td>' + report.created_at.substring(11, 19) + '</td>'; // Time
			rows += '<td><a data-dismiss="modal" href="map" onclick="window.centreMapOnPopup('+report.pkey+')")>'+text+'</a></td>'; // Message
		rows += '</tr>';
	}
	thead = '<table class="table table-hover"><thead><tr><th class="col-xs-2">Waktu</th><th class="col-xs-6">Laporkan</th></tr></thead>';

	var tbody = '<tbody>'+rows+'</tbody></table>';
	$("#reportsModal .modal-body").append(thead+tbody);

}
