/**
 * @license
 * Copyright (c) 2018 shingo45endo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
	'use strict';

	// Checks whether the URL is correct.
	if (location.href.indexOf('https://iknow.jp/home/calendars') !== 0) {
		alert('Go to iKnow calendar page.');
		return;
	}

	var studySecs = {};

	var dt = new Date();
	var dtStr = String(dt.getFullYear()) + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);
	var fileName = 'iknow-studytime_' + dtStr + '.csv';

	// Adds the CSV Download section.
	$('#my-csv-download').remove();
	$('.monthly-calendar').before('<section id="my-csv-download" class="content-container"><header class="content-details"><div class="details-primary">CSV Download</div></header><div class="content-primary"><a id="my-csv-file" href="#">Now downloading</a></div></section>');

	// Sets a handler of the download link.
	$('#my-csv-file').on('click', function() {
		// Makes a 2-D array of study time.
		var cells = Object.keys(studySecs).sort().reverse().map(function(key) {
			return [key, studySecs[key]];
		});

		// Makes a blog of CSV file.
		var blob = makeCsvBlob(cells);

		// Sets the attributes of the download link.
		$(this).attr({
			href: (URL || webkitURL).createObjectURL(blob),
			type: 'text/csv',
			download: fileName
		});

		if (navigator.msSaveBlob) {
			navigator.msSaveOrOpenBlob(blob, fileName);
		}
	});

	// Waits for adding new calendar.
	var calendarObserver = new MutationObserver(function(records) {
		records.filter(function(record) {return (record.type === 'childList');}).forEach(function (record) {
			Array.prototype.slice.call(record.addedNodes).filter(function(addedNode) {return (addedNode.className === 'calendar');}).forEach(function() {
				setTimeout(function() {
					// Gets all the study time in the current calendar.
					$('.daily_stats').each(function() {
						var datetime = $('time[datetime]', $(this)).attr('datetime');
						var studytime = text2sec($.trim($('.study_time', $(this)).text()));
						if (studytime > 0) {
							studySecs[datetime] = studytime;
						}
					});

					// If the prev button exist, clicks it to remove/add the current calendar.
					var $prev = $('a[rel=prev]');
					if ($prev.length !== 0) {
						$prev.click();
						$('#my-csv-file').text($('#my-csv-file').text() + '.');
					} else {
						calendarObserver.disconnect();
						$('#my-csv-file').text(fileName);
					}
				}, 1000);
			});
		});
	});
	calendarObserver.observe($('#calendar_container .loaded')[0], {childList: true});

	// Triggers adding new calendar by calling global "calendar()".
	/* global calendar */
	calendar(dtStr);

	// Makes a blob of CSV.
	function makeCsvBlob(cells) {
		// Converts 2-D fields to CSV string.
		var csv = cells.map(function(fields) {
			return fields.map(function(field) {
				return '"' + String(field).replace(/"/g, '""') + '"';
			}).join(',') + '\r\n';
		}).join('');

		// Makes a blob. ([0xef, 0xbb, 0xbf] is a BOM for Microsoft Excel)
		var blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv]);

		return blob;
	}

	// Converts "1h 2m 3s" like string to sec. ("1h 2m 3s" -> 3721 [sec])
	function text2sec(str) {
		return [
			{sec: 3600, regexp: /(\d+)(h|時間)/},
			{sec:   60, regexp: /(\d+)(m|分)/},
			{sec:    1, regexp: /(\d+)(s|秒)/},
		].reduce(function(total, elem) {
			var m = str.match(elem.regexp);
			if (m) {
//				console.assert(m.length === 3);
				total += elem.sec * parseInt(m[1], 10);
			}
			return total;
		}, 0);
	}
})();
