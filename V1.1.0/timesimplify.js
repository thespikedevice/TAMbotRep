module.exports = {
	simplify: function(number) {
		var nN=number
		var ms = nN%1000
		nN-=(number%1000)
		var seconds=nN%60000
		nN-=nN%60000
		var minutes=nN%3600000
		nN-=nN%3600000
		var timeT=""
		if (minutes>0) {
			timeT = timeT + (minutes/60000) + " m "
		}
		if (seconds>0) {
			timeT = timeT + (seconds/1000) + " s "
		}
		if (ms>0) {
			timeT = timeT + (ms) + " ms"
		}
    return timeT
	}
}