export default {
	word(str){
		return str.replace(/\n/g,"<br/>")
	},
	
	read(str){
		return str.split(/\n/g)
	}
}
