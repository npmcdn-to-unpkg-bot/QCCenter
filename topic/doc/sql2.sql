��Ʒ���շ���ͼ	SELECT a.ProductName AS [Ʒ��] , a.TechTypeName AS [��������],a.ProcName AS [����], a.TeamName AS [����], a.MachineName AS [��̨], count(*) as ������ FROM dbo.CartInfoData AS a WHERE a.NoteAnayID > 0 and CONVERT(varchar,a.StartDate,112) between ? And ? group by ProductName,TechTypeName,ProcName,TeamName,MachineName,CaptainName order by 1,2,3,4,5,6	tstart,tend	�༭	ɾ��
�¼�����ͼ1	SELECT CAST ( LEFT (a.��������, 4) AS VARCHAR ) + '/' + CAST ( SUBSTRING (cast(a.�������� as varchar), 5, 2) AS VARCHAR ) + '/' + CAST ( RIGHT (a.��������, 2) AS VARCHAR ) as ����, round(CAST (a.���� AS FLOAT) * 100 / b.����,2) AS ����, a.Ʒ�� FROM ( SELECT a.Ʒ��, a.��������, COUNT (*) AS ���� FROM dbo.view_print_hecha AS a WHERE a.�������� BETWEEN ? AND ? AND ��Ʒ�� > 70 GROUP BY a.Ʒ��, a.�������� ) a INNER JOIN ( SELECT a.��������, COUNT (*) AS ���� FROM dbo.view_print_hecha AS a WHERE a.�������� BETWEEN ? AND ? AND ��Ʒ�� > 70 GROUP BY a.�������� ) b ON a.�������� = b.��������	tstart,tend,tstart2,tend2	�༭	ɾ��
Sankey Test	SELECT a.TeamName AS [����], a.MachineName AS [��̨], count(*) as ������ FROM dbo.CartInfoData AS a WHERE a.NoteAnayID > 0 and CONVERT(varchar,a.StartDate,112) between ? And ? group by TeamName,MachineName order by 1,2


��Ʒδ���¼�����

SELECT CAST ( LEFT (a.��������, 4) AS VARCHAR ) + '/' + CAST ( SUBSTRING ( CAST (a.�������� AS VARCHAR), 5, 2 ) AS VARCHAR ) + '/' + CAST ( RIGHT (a.��������, 2) AS VARCHAR ) AS ����, SUM (a.δ������) AS δ����, a.��̨ FROM [dbo].[view_print_hecha] a WHERE a.�������� BETWEEN ? AND ? GROUP BY a.��������, a.��̨ ORDER BY 1, 2 

//168 DASHBOARDͳ����Ϣ
SELECT a.��������, a.�ϴ�������, b.ʵʱ����, a.�쳣��Ʒ FROM ( SELECT SUM ( CASE WHEN ��Ʒ�� < 70 THEN 1 ELSE 0 END ) AS ��������, COUNT (*) �ϴ�������, SUM ( CASE WHEN ( ����1ȱ���� = 0 OR ��2 = 0 OR ��3 = 0 OR ��4 = 0 OR ��5 = 0 OR ����1ȱ���� = 0 OR ��2 = 0 OR ��3 = 0 OR ��4 = 0 ) THEN 1 ELSE 0 END ) AS �쳣��Ʒ FROM dbo.view_print_hecha WHERE �������� / 100 = convert(varchar(6),GETDATE(),112) ) a, ( SELECT COUNT (*) AS ʵʱ���� FROM dbo.view_print_online_quality WHERE ��Ʒ�� < 80 AND CONVERT (VARCHAR, �ϴ�ʱ��, 112) = convert(varchar,GETDATE(),112) ) b


//169 ���һ��������Ϣ
SELECT max( CASE WHEN Ʒ�� = '9602A' THEN ƽ����Ʒ�� ELSE 0 END ) AS '9602A', max( CASE WHEN Ʒ�� = '9603A' THEN ƽ����Ʒ�� ELSE 0 END ) AS '9603A' , max( CASE WHEN Ʒ�� = '9604A' THEN ƽ����Ʒ�� ELSE 0 END ) AS '9604A', max( CASE WHEN Ʒ�� = '9606A' THEN ƽ����Ʒ�� ELSE 0 END ) AS '9606A', max( CASE WHEN Ʒ�� = '9607T' THEN ƽ����Ʒ�� ELSE 0 END ) AS '9607T' FROM ( SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE a.�������� = ( SELECT MAX (��������) FROM view_print_hecha ) GROUP BY Ʒ�� ) a 

SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE a.�������� = ( SELECT MAX (��������) FROM view_print_hecha ) GROUP BY Ʒ�� 

//170����

SELECT isnull(max( CASE WHEN Ʒ�� = '9602A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9602A', isnull(max( CASE WHEN Ʒ�� = '9603A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9603A' , isnull(max( CASE WHEN Ʒ�� = '9604A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9604A', isnull(max( CASE WHEN Ʒ�� = '9606A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9606A', isnull(max( CASE WHEN Ʒ�� = '9607T' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9607T' FROM ( SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE DATEDIFF(week, ����ʱ��, getdate())=0 GROUP BY Ʒ�� ) a 

 SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE DATEDIFF(week, ����ʱ��, getdate())=0 GROUP BY Ʒ�� 		

//171����

SELECT isnull(max( CASE WHEN Ʒ�� = '9602A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9602A', isnull(max( CASE WHEN Ʒ�� = '9603A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9603A' , isnull(max( CASE WHEN Ʒ�� = '9604A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9604A', isnull(max( CASE WHEN Ʒ�� = '9606A' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9606A', isnull(max( CASE WHEN Ʒ�� = '9607T' THEN ƽ����Ʒ�� ELSE 0 END ),0) AS '9607T' FROM ( SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE DATEDIFF(mm, ����ʱ��, getdate())=0 GROUP BY Ʒ�� ) a 

 SELECT a.Ʒ��, round(AVG(a.��Ʒ��), 2) AS ƽ����Ʒ�� FROM dbo.view_print_hecha AS a WHERE DATEDIFF(mm, ����ʱ��, getdate())=0 GROUP BY Ʒ�� 
 
 //��ȥһ������¶�ƽ����Ʒ��
 172
select left(��������,4)+'-'+substring(cast(�������� as varchar),5,2) as �·�,round(avg(��Ʒ��),2) as ƽ����Ʒ�� from view_print_hecha where DATEDIFF(month, ����ʱ��, getdate())<=12 group by left(��������,4)+'-'+substring(cast(�������� as varchar),5,2) 

//ʵʱ����
173
SELECT a.��̨, a.��Ʒ��, a.D�̿���, a.��ʾվDB, a.�ϴ�������,a.machineTypeID FROM dbo.view_print_online_quality AS a WHERE DATEDIFF(day, �ϴ�ʱ��, GETDATE()) = 0 

//����/��������
xxx
select b.Ʒ��,isnull(a.����,0) as ���һ��,b.���� from (SELECT Ʒ��, round(AVG(��Ʒ��), 2) AS ���� FROM dbo.view_print_hecha WHERE �������� = ( SELECT MAX (producedate) FROM MaHouData ) GROUP BY Ʒ��, ��������) a RIGHT JOIN (SELECT Ʒ��, round(AVG(��Ʒ��), 2) AS ���� FROM dbo.view_print_hecha WHERE �������� / 100 = ( SELECT TOP 1 producedate / 100 FROM MaHouData WHERE ProduceDate < ( SELECT MAX (ProduceDate) FROM mahoudata ) ORDER BY ProduceDate DESC ) GROUP BY Ʒ��, �������� / 100)b on b.Ʒ��= a.Ʒ�� 

//174 ĳ�豸���ں�Ʒ��
SELECT top 15 a.CartNumber as ����, a.GoodRate as ��Ʒ�� FROM dbo.MaHouData AS a INNER JOIN dbo.MachineData b on a.machineid=b.machineid where b.MachineName = �� order by a.ID desc 

//175������������ˮƽ
SELECT a.ProductType AS Ʒ��, round(AVG(a.cutRatio), 2) AS ����÷�, round(AVG(a.ManualCutScore), 2) AS �˹��÷�, round(  AVG (  a.ManualCutScore * 0.3 + a.cutRatio * 0.7  ),  2 ) AS �����ܷ� FROM dbo.view_print_note_ananysis_score AS a WHERE a.ProcName LIKE '��%' AND a.date BETWEEN ? AND ? GROUP BY ProductType 

����̨ 176
SELECT a.CaptainName AS ����, round(AVG(a.cutRatio), 2) AS ����÷�, round(AVG(a.ManualCutScore), 2) AS �˹��÷�, round( AVG ( a.ManualCutScore * 0.3 + a.cutRatio * 0.7 ), 2 ) AS �ܷ� FROM dbo.view_print_note_ananysis_score AS a WHERE a.ProcName LIKE '��%' AND left(a.date,6)=CONVERT(varchar(6),GETDATE(),112) GROUP BY CaptainName ORDER BY 4 desc
