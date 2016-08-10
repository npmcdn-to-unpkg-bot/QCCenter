<?php
class DataInterfaceModel extends CI_Model {
	const PRE_STR 	= 'QCCenter';//字符前缀

	/**
	 * 表单名列表定义(select id,name from sysobjects where xtype = 'U')
	 */
	//0-10 质量中心数据库
	const TBL_PHYSIC 	= 'Paper_Para_PscData';      //0 物理站
	const TBL_CHEM		= 'Paper_Para_ChemData';	 //1 化验站
	const TBL_SURFACE 	= 'Paper_Para_SurfaceData';	 //2 物理外观指标
	const TBL_PPR_OPR	= 'Paper_Para_Operator';	 //3 操作员
	const TBL_PPR_PROD	= 'Paper_ProductData';		 //4 钞纸品种
	const TBL_PPR_MCH	= 'Paper_Machine_Info';		 //5 钞纸机台
	const TBL_PRT_PROD	= 'ProductData';			 //6 印钞品种
	const TBL_PRT_MCH	= 'MachineData';			 //7 印钞机台
	const TBL_PPR_VALIDATE	= 'Paper_Validate';		 //8 纸张验证
	const TBL_PRINT_FAKEPIECE	= 'FakePieceData';	 //9 印钞大张废
	const TBL_PAPER_FALSEWASTE = "Paper_False_Waste"; //10 	钞纸损纸误废
	const TBL_PAPER_BATCHWASTE = "Paper_Batch_Waste"; //11 	钞纸批量报废
	const TBL_PAPER_PENALTY = "Paper_Penalty"; //12 	考核记录

	const TBL_USR		= 'tblUser';				 //20 用户信息
	const TBL_DPMT		= 'tblDepartMent';			 //21 用户所在部门/分组
	const TBL_WORK_LOG_PROC	= 'tblWorkProc';			 //22 工作日志_工序

	const TBL_WORK_LOG 	= 'tblWorkLog_Record';		 //25 工作日志
	const TBL_WORK_LOG_STUS = 'tblWorkProStatus';	 //26 工作日志_故障处理状态
	const TBL_WORK_ERR_LIST = 'tblWorkErrDesc';		 //27 工作日志_故障类型
	const TBL_MIC_BLOG	= 'tblMicroBlog_Record';	 //28 个人记事本
	const TBL_DB		= 'tblDataBaseInfo';		 //29 数据库列表
	const TBL_API		= 'tblDataInterface';		 //30 API列表
	const TBL_SELECT	= 'tblSettings_Select_List'; //31 下拉框列表
	const TBL_WORK_LOG_OPR = 'tblWorklog_Operator';	 //32 机检日志人员名单
	const TBL_SETTINGS_MENULIST ='tbl_menu_list';	 //33 菜单列表
	const TBL_SETTINGS_MENUDETAIL='tbl_menu_detail'; //34 菜单子项
	public function __construct()
	{
		$this->load->database();
	}

	public function getDBName($id)
	{
		$tblName = array(
			0 =>self::TBL_PHYSIC,
			1 =>self::TBL_CHEM,
			2 =>self::TBL_SURFACE,
			3 =>self::TBL_PPR_OPR,
			4 =>self::TBL_PPR_PROD,
			5 =>self::TBL_PPR_MCH,
			6 =>self::TBL_PRT_PROD,
			7 =>self::TBL_PRT_MCH,
			8 =>self::TBL_PPR_VALIDATE,
			9 =>self::TBL_PRINT_FAKEPIECE,
			10=>self::TBL_PAPER_FALSEWASTE,
			11=>self::TBL_PAPER_BATCHWASTE,
			12=>self::TBL_PAPER_PENALTY,

			20=>self::TBL_USR,
			21=>self::TBL_DPMT,
			25=>self::TBL_WORK_LOG,
			26=>self::TBL_WORK_LOG_STUS,
			27=>self::TBL_WORK_ERR_LIST,
			28=>self::TBL_MIC_BLOG,
			29=>self::TBL_DB,
			30=>self::TBL_API,
			31=>self::TBL_SELECT,
			32=>self::TBL_WORK_LOG_OPR,
			33=>self::TBL_SETTINGS_MENULIST,
			34=>self::TBL_SETTINGS_MENUDETAIL
		);
		return $tblName[$id];
	}

	public function TransToUTF($str){
		$encode_Arr = array('ASCII','UTF-8','GBK','GB2312','EUC-CN');
		/*$encode = mb_detect_encoding($str,$encode_Arr);
		if($encode == 'CP936'){
			$encode = 'GBK';
			$str = iconv('GBK','UTF-8',$str);
		}*/
		$str = mb_convert_encoding($str,'UTF-8',$encode_Arr);

		return $str;
	}
	public function TransToGBK($str){

		$encode_Arr = array('ASCII','UTF-8','GBK','GB2312','EUC-CN');
		/*$encode = mb_detect_encoding($str,$encode_Arr);
		if($encode == 'CP936'){
			$encode = 'GBK';
			return $str;
		}*/
		$str = mb_convert_encoding($str,'GBK',$encode_Arr);
		return $str;
	}

	public function GetNewApiID($UserName)
	{
		$LOGINDB=$this->load->database('sqlsvr',TRUE);
		$StrSQL = "SELECT ISNULL(MAX(ApiID),0)+1 as NewID  FROM  tblDataInterface  where AuthorName=?";
		$query = $LOGINDB->query($StrSQL,array($UserName));
		$strJson = $query->result_json();
		$strReturn = json_decode($strJson)->data[0]->NewID;
		//$query->free_result(); //清理内存
		//$LOGINDB->close();//关闭连接
		return $strReturn;
	}

	public function SaveAPI($data)
	{
		$this->load->helper('url');
	  	//判断用户名是否已存在
		$LOGINDB=$this->load->database('sqlsvr',TRUE);
		//先获取当前用户ID
		$data['ApiName'] = $this->TransToGBK($data['ApiName']);
		//$data['AuthorName'] = sha1($data['AuthorName']);
		$data['AuthorName'] = $this->TransToGBK($data['AuthorName']);
		$data['Token'] = sha1(self::PRE_STR.$data['AuthorName']);
		$data['ApiDesc'] = $this->TransToGBK($data['ApiDesc']);
		//$data['strSQL'] = $this->TransToGBK($data['strSQL']);
		$data['strSQL'] = base64_encode($data['strSQL']);

		//$SQLStr="SELECT top 1 ID from tblDataInterface WHERE AuthorName= '". $data['AuthorName'] ."' and ApiID = ".$data['ApiID'];
		//$query=$LOGINDB->query($SQLStr);
		//if($query->num_rows()>0)
		//{
			//更新
		//	$LOGINDB->where('AuthorName', $data['AuthorName']);
		//	$LOGINDB->where('ApiID', $data['ApiID']);
		//	$LOGINDB->update('tblDataInterface', $data);
		//}else
		//{
			//添加
			$LOGINDB->insert('tblDataInterface', $data);
		//}
		$Logout['ID'] = $LOGINDB->insert_id();
		if($Logout['ID'])
		{
			$Logout['message'] = '操作成功';//注册成功
			$Logout['status'] = '1';
			$Logout['NewID'] = (int)$data['ApiID']+1;
		}
		else
		{
			$Logout['message'] = '操作失败';//注册失败
			$Logout['status'] = '0';
			$Logout['NewID'] = $data['ApiID'];
		}
	  	//$LOGINDB->close();//关闭连接
		return $Logout;
	}

	//M:1预览模式;0输出SQL语句；
	//2输出质量数据;3预览模式（输出最多10行数据）;4.输出列名
	public function Api($data)
	{
		$this->load->helper('url');
	  	//判断用户名是否已存在
		$LOGINDB=$this->load->database('sqlsvr',TRUE);
		//先获取当前用户ID
		$SQLStr = "SELECT a.ApiID,a.ApiName,a.AuthorName,a.strSQL,a.Params,a.DBID,a.URL,b.DBName from tblDataInterface a INNER JOIN tblDataBaseInfo b on a.DBID=B.DBID WHERE Token = ? and ApiID=".$data['ID'];
		$query=$LOGINDB->query($SQLStr,array($data['Token']));
		$strJson = $query->result_json();

		$ApiInfo = json_decode($strJson);
		//$query->free_result(); //清理内存
		//$LOGINDB->close();//关闭连接

		if(!isset($ApiInfo->rows) || !$ApiInfo->rows){
			return $strJson;
		}
		//解析params,用于SQL查询参数
		$aParTemp = explode(',',$ApiInfo->data[0]->Params);
		if($aParTemp[0]==''){//当参数为空时
			$aParTemp[0] = 1;
		}
		else
		{
			for( $i=0;$i<count($aParTemp);$i++ ){
				//对TSTART1 TSTART2做特殊处理
				$flag = 1;
				if($aParTemp[$i] == 'tstart2'){
					if(!isset($data[$aParTemp[$i]])){
						$aParTemp[$i] = $data['tstart'];
						$flag = 0;
					}
				}elseif($aParTemp[$i] == 'tend2'){
					if(!isset($data[$aParTemp[$i]])){
						$aParTemp[$i] = $data['tend'];
						$flag = 0;
					}
				}
				if($flag){
					$aParTemp[$i] = $data[$aParTemp[$i]];
				}
			}
		}

		switch ($data['M']) {
			case 'edit':
				$strApiInfo = $strJson;
				break;
			case '0':
			case '2':
			case '3':
				$strApiInfo = $this->ShowApiData($aParTemp,$ApiInfo->data[0],$data['M']);//输出质量数据
				break;
			case '1':
				$strApiInfo = $this->ShowApiData($aParTemp,$ApiInfo->data[0],$data['M']);//输出列名
				return '{"rows":0,'.$strApiInfo.',"title":"'.$ApiInfo->data[0]->ApiName.'","source":"数据来源:'.$ApiInfo->data[0]->DBName.'"}';
				break;
		}
		//方案1：JSON编码
		//$Api = json_decode($strApiInfo,FALSE);//为TRUE时转换为Object
		//$Api->title = $ApiInfo->data[0]->ApiName;
		//$Api->source = '数据来源:'.$ApiInfo->data[0]->DBName;
		//JSON ENCODE加入 编码说明，支持中文
		//$strJson = json_encode($Api,JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

		//方案2：字符串拼接
		$strJson = rtrim($strApiInfo,'}').',"title":"'.$ApiInfo->data[0]->ApiName.'","source":"数据来源:'.$ApiInfo->data[0]->DBName.'"}';
		return $strJson;
	}

	//工序，每页多少条，处理状态，时间范围,当前ID
	public function ShowApiData($aParams,$ApiInfo,$mode)
	{
		/*
		使用BASE64编码,避免UTF2GBK时某些字符转换失败的问题而导致后续的  标记符?  在替换时造成的各种不兼容;
		*/
		$SQLStr = $this->TransToUTF(base64_decode($ApiInfo->strSQL));
		switch ($ApiInfo->DBID) {
			case '0': //MSSQLSERVER
				$LOGINDB=$this->load->database('Quality',TRUE);
				break;
			case '1'://ORCAL
				$LOGINDB=$this->load->database('XZHC',TRUE);
				break;
			case '2'://ORCAL
				$LOGINDB=$this->load->database('QFM',TRUE);
				break;
			case '3'://ORCAL
				$LOGINDB=$this->load->database('JTZY',TRUE);
				break;
			case '4'://ORCAL
				$LOGINDB=$this->load->database('KG',TRUE);
				break;
			case '5'://MSSQLSERVER
				$LOGINDB=$this->load->database('sqlsvr',TRUE);
				break;
			case '6'://ORCAL
				$LOGINDB=$this->load->database('SHY',TRUE);
				break;
			case '7'://ORCAL
				$LOGINDB=$this->load->database('ZXQS',TRUE);
				break;
			case '8'://ORCAL
				$LOGINDB=$this->load->database('OFFICEHELPER',TRUE);
				break;
			case '9'://ORCAL
				$LOGINDB=$this->load->database('CZUSER',TRUE);
				break;
		}

		if ($mode == 0 ) {
			//$query = $LOGINDB->query($this->TransToGBK($SQLStr),$aParams);
			$SQLStr = $this->handleStr($SQLStr,$aParams);
			if($ApiInfo->DBID == 9){//钞纸机检在线质量检测系统,编码问题
				$query = $LOGINDB->query($SQLStr);
			}else{
				$query = $LOGINDB->query($this->TransToGBK($SQLStr));
			}
			$strJson = $query->result_json($ApiInfo->DBID);
		}
		else if($mode == 1 ) {
			if($ApiInfo->DBID == 0 || $ApiInfo->DBID== 5){ //MS SQL SERVER
				$SQLStr = str_ireplace('select ', 'SELECT TOP 0 ',$SQLStr);
			}else{
				$SQLStr = "select * from (". $SQLStr . ")where rownum<1";
			}
			//$query = $LOGINDB->query($this->TransToGBK($SQLStr),$aParams);
			$SQLStr = $this->handleStr($SQLStr,$aParams);
			if($ApiInfo->DBID == 9){//钞纸机检在线质量检测系统,编码问题
				$query = $LOGINDB->query($SQLStr);
			}else{
				$query = $LOGINDB->query($this->TransToGBK($SQLStr));
			}
			$strJson = $query->result_json();
			$strFileds = $query->list_fields();
			$strJson = $query->Array2Head($strFileds);
		}
		else if($mode == 2 ) {
			if($ApiInfo->DBID == 0 || $ApiInfo->DBID== 5){ //MS SQL SERVER
				$SQLStr = str_ireplace('select ', 'SELECT TOP 10 ',$SQLStr);
			}else{
				$SQLStr = "select * from (". $SQLStr . ")where rownum<11";
			}
			//$query = $LOGINDB->query($this->TransToGBK($SQLStr),$aParams);
			$SQLStr = $this->handleStr($SQLStr,$aParams);
			if($ApiInfo->DBID == 9){//钞纸机检在线质量检测系统,编码问题
				$query = $LOGINDB->query($SQLStr);
			}else{
				$query = $LOGINDB->query($this->TransToGBK($SQLStr));
			}
			$strJson = $query->result_json($ApiInfo->DBID);
		}
		else if ($mode == 3 ) {
			//不使用官方替换字符串的函数(在处理ORCAL的查询语句时会报错);
			//$query = $LOGINDB->query($this->TransToGBK($SQLStr),$aParams);
			$SQLStr = $this->handleStr($SQLStr,$aParams);
			if($ApiInfo->DBID == 9){//钞纸机检在线质量检测系统,编码问题
				$query = $LOGINDB->query($SQLStr);
			}else{
				$query = $LOGINDB->query($this->TransToGBK($SQLStr));
			}

			$strJson = $query->result_datatable_json($ApiInfo->DBID);
		}
		//$query->free_result(); //清理内存
		//$LOGINDB->close();//关闭连接
		return $strJson;
	}
	public function handleStr($str,$params)
	{
		$iCount = count($params);
		$str = $this->TransToUTF($str);
		$str = str_replace("'?'","?",$str);
		if($iCount == 0)//无待替换字符时
		{
			$strOut = $str;
		}else if($iCount == 1)//只有一个
		{
			$strOut = str_replace("?","'".$params[0]."'",$str);
		}else//有多个
		{
			$strTemp = explode('?',$str);
			$strOut = " ";
			for( $i=0;$i<count($strTemp)-1;$i++ ){
				//$strOut .= str_replace("?","'".$params[$i]."'",$strTemp[$i].'?') ;
				$strOut .= $strTemp[$i]."'".$params[$i]."'" ;
			}
			$strOut .= $strTemp[count($strTemp)-1];
		}
		$strOut = str_replace("[","",$strOut);
		$strOut = str_replace("]","",$strOut);
		//print_r($strOut);
		/*if(mb_detect_encoding($strOut,array('ASCII','EUC-CN','GBK')) == 'CP936'){
			$strOut = mb_convert_encoding($strOut,"GBK",array('UTF-8'));
		}	*/
		return $strOut;
	}
	//读取日志查询设置
	public function ReadSettings($data)
	{
		$this->load->helper('url');
	  	//判断用户名是否已存在
		$LOGINDB=$this->load->database('sqlsvr',TRUE);
		//先获取当前用户ID
		$data['UserName'] = iconv("utf-8","gbk",$data['UserName']);
		$SQLStr = "SELECT top 1 a.* from tblQualityTable_Settings a INNER JOIN tblUser b on a.UserID = b.ID WHERE b.UserName = ?";
		$query=$LOGINDB->query($SQLStr,array($data['UserName']));
		$strJson = $query->result_json();
		//$query->free_result(); //清理内存
		//$LOGINDB->close();//关闭连接
		return $strJson;
	}


	//读取日志查询设置
	public function convert2Base64()
	{
		$this->load->helper('url');
	  	//判断用户名是否已存在
		$LOGINDB=$this->load->database('sqlsvr',TRUE);
		//先获取当前用户ID
		$SQLStr="SELECT ID,strSQL from tblDataInterface where ID=116";
		$query=$LOGINDB->query($SQLStr);
		foreach($query->result() as $row)
		{
			/*$data['strSQL'] = base64_decode($row->strSQL);
			$where = '[id] = '.$row->ID;
			$LOGINDB->update('tblDataInterface', $data,$where);*/
			print_r(base64_decode($row->strSQL)."<br>");
		}
		//$LOGINDB->close();//关闭连接
		//$query->free_result();
	}

	public function insert($data)
	{
		if ($data['tbl'] >= 20) {
			$LOGINDB=$this->load->database('sqlsvr',TRUE);
		}else{
			$LOGINDB=$this->load->database('Quality',TRUE);
		}

		foreach ($data['utf2gbk'] as $str)
		{
			$data[$str] = $this->TransToGBK($data[$str]);
		}
		unset($data['utf2gbk']);
		$tblName = $this->getDBName($data['tbl']);
		unset($data['tbl']);
		$LOGINDB->insert($tblName, $data);
		return $LOGINDB->insert_id();
	}

	public function delete($data)
	{
		if ($data['tbl'] >= 20) {
			$LOGINDB=$this->load->database('sqlsvr',TRUE);
		}else{
			$LOGINDB=$this->load->database('Quality',TRUE);
		}
		$condition['id'] = $data['id'];
		$tblName = $this->getDBName($data['tbl']);
        return $LOGINDB->where($condition)->delete($tblName);
	}

	public function update($data)
	{
		if ($data['tbl'] >= 20) {
			$LOGINDB=$this->load->database('sqlsvr',TRUE);
		}else{
			$LOGINDB=$this->load->database('Quality',TRUE);
		}

		if (isset($data['utf2gbk']))
		{
			foreach ($data['utf2gbk'] as $str)
			{
				$data[$str] = $this->TransToGBK($data[$str]);
			}
		}

		$tblName = $this->getDBName($data['tbl']);
		$where = '[id] = '.$data['id'];
		unset($data['tbl']);
		unset($data['id']);
		unset($data['utf2gbk']);
        //$data['is_del'] = 1;
        return $LOGINDB->update($tblName, $data,$where);
	}
}