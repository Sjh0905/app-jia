/**
 * Created by chest on 10/08/2019.
 */


export default  function (key,params,bind,method) {



	return new Promise((res,rej)=>{
		let o  = {
			callback(...para){
				res(...para)
			}
		}

		if(method === 'get'){
			bind.$http.send(key,{bind,query:params,callBack:o.callback})
			return
		}

		bind.$http.send(key,{bind,params,callBack:o.callback})

	})
}