SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER procedure [dbo].[spcp_cria_lote_12]
	@id_num int,
	@fil varchar(3),
	@prod varchar(15),
	@op varchar(11),
	@lote varchar(9),
	@qtdes float,
	@quebraLote float,
	@quebraAnalise float
as


-- @id_num, @fil, @prod, @op, @lote, @qtdes, @quebraLote, @quebraAnalise
declare 
	@saldo float,
	@qtdeLote float,
	@qtdeAnalise float, 
	@qtdeReg float,
	@qtdeInc float,
	@idOrig int,
	@conta int,
	@loteProx varchar(9),
	@loteFilial varchar(9),
	@loteProduto varchar(9),
	@loteEspec varchar(9),
	@loteAnt varchar(9),
	@loteAprov varchar(15),
	@produto varchar(15),
	@qtdeQuebra float, 
	@analise varchar(3), 
	@filial varchar(3), 
	@qtdeQuebraAnalise float, 
	@regTipo varchar(1),
	@saldoLote float,
	@saldoAnalise float


set @qtdeReg = @qtdes

declare opProd cursor for
	select
		id_num idOrig, a.filial, a.produto, a.lote, loteAprov, 
		qtdeLote, qtdeQuebra, analise, qtdeAnalise, 
		qtdeQuebraAnalise, regTipo, saldo
	from
		oppcfLote a inner join
		(select 
			filial, op, produto, lote, 
			sum(qtdeLote) totLote, max(qtdeQuebra) quebra,
			isnull(max(qtdeQuebraAnalise) - sum(qtdeAnalise), 0) saldo
		from 
			PCP..oppcfLote
		where
			1 = 1
			and lote > '000000000'
		group by
			filial, op, produto, lote
		having
			max(qtdeQuebra) > sum(qtdeLote))b on
		a.filial = b.filial 
		and a.op = b.op
		and a.produto = b.produto
		and a.lote = b.lote 
	where
		1 = 1
		and a.filial = @fil
		and a.op = @op
		and a.produto = @prod
		and qtdeAnalise < qtdeQuebraAnalise
    
open opProd
fetch next from opProd   
into @idOrig, @filial, @produto, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo, @saldo

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
        if @loteAprov <> 'ABERTO'
			begin
				set @qtdeReg = @qtdeReg - @saldo
			end
		else 
			begin 
				if @qtdeReg > @saldo
					begin
						update PCP..oppcfLote set qtde = qtde + @saldo, qtdeLote = qtdeLote + @saldo, qtdeAnalise = qtdeAnalise + @saldo, qtdeImp = 5, regTipo = 'A' where id_num = @idOrig
						set @qtdeReg = @qtdeReg - @saldo
						set @saldo = 0
					end
				else
					begin 
						update PCP..oppcfLote set qtde = qtde + @qtdeReg, qtdeLote = qtdeLote + @qtdeReg, qtdeAnalise = qtdeAnalise + @qtdeReg, qtdeImp = 5, regTipo = 'B' where id_num = @idOrig
						set @qtdeReg = 0
					end
		end

		fetch next from opProd   
		into @idOrig, @filial, @produto, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo, @saldo
	end


if @qtdeReg > 0
    begin
		print @qtdeReg
	    set @loteFilial = (isnull((select max(lote) from oppcfLote where filial = @fil and op = @op and produto = @prod and lote <> '000000000'), '000000000'))
		set @analise = 'A01'
        set @saldoLote = @quebraLote
        
        if @loteFilial > '000000000'
            begin 
                set @qtdeLote = (select sum(qtdeLote) from oppcfLote where filial = @fil and op = @op and produto = @prod and lote = @loteFilial)
                if @qtdeLote < @quebraLote
                    begin
                        set @loteProx = @loteFilial
                        set @saldoLote = @quebraLote - @qtdeLote
                    end
                else
                    begin
                        set @loteEspec = (isnull((select loteAtual from PCP..qualEspecCab where cabProduto = @prod and situacao = 'Concluida'), '000000000'))
                        set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @prod and lote <> '000000000'), '000000000'))
                        set @loteProx = right('000000000' + convert(varchar(9), cast(case when @loteEspec >= @loteProduto then @loteEspec else @loteProduto end as int) + 1), 9)
                        set @saldoLote = @quebraLote
                    end
            end
        else
            begin 
                set @loteEspec = (isnull((select loteAtual from PCP..qualEspecCab where cabProduto = @prod and situacao = 'Concluida'), '000000000'))
                set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @prod and lote <> '000000000'), '000000000'))
                set @loteProx = right('000000000' + convert(varchar(9), cast(case when @loteEspec >= @loteProduto then @loteEspec else @loteProduto end as int) + 1), 9)
            end
        while @qtdeReg > 0
            begin 
                if @saldoLote >= @quebraAnalise
                    begin 
                        if @qtdeReg > @quebraAnalise
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,           qtdeLote,       qtdeAnalise,    dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @quebraAnalise, @quebraAnalise, @quebraAnalise, dtime, dtcria, situacao, codRecurso, @loteProx, origem, stsLote, @analise, 'ABERTO',  qtdeQuebra, qtdeQuebraAnalise, 'C',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
						                                    
                                set @qtdeReg = @qtdeReg - @quebraAnalise
                                set @saldoLote = @saldoLote - @quebraAnalise
                                exec spcp_cria_lote_carac @fil, @prod, @loteProx, @analise
                            end
                        else
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,     qtdeLote, qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @qtdeReg, @qtdeReg, @qtdeReg,    dtime, dtcria, situacao, codRecurso, @loteProx, origem, stsLote, @analise, 'ABERTO',  qtdeQuebra, qtdeQuebraAnalise, 'D',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                set @saldoLote = @saldoLote - @qtdeReg
                                set @qtdeReg = 0
                                exec spcp_cria_lote_carac @fil, @prod, @loteProx, @analise
                            end
                    end
                else
                    begin 
                        if @qtdeReg > @saldoLote
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,       qtdeLote,   qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @saldoLote, @saldoLote, @saldoLote,  dtime, dtcria, situacao, codRecurso, @loteProx, origem, stsLote, @analise, 'ABERTO',  qtdeQuebra, qtdeQuebraAnalise, 'E',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                set @qtdeReg = @qtdeReg - @saldoLote
                                set @saldoLote = 0
                                exec spcp_cria_lote_carac @fil, @prod, @loteProx, @analise
                            end
                        else
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,     qtdeLote, qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @qtdeReg, @qtdeReg, @qtdeReg,    dtime, dtcria, situacao, codRecurso, @loteProx, origem, stsLote, @analise, 'ABERTO',  qtdeQuebra, qtdeQuebraAnalise, 'F',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                set @saldoLote = @saldoLote - @qtdeReg
                                set @qtdeReg = 0
                                exec spcp_cria_lote_carac @fil, @prod, @loteProx, @analise
                            end
                    end
                if @saldoLote <= 0
                    begin 
						print @saldoLote
                        set @saldoLote = @quebraLote
                        set @loteProx = right('000000000' + convert(varchar(9), cast(@loteProx as int) + 1), 9)
				        set @analise = 'A00'
                    end
                set @analise = 'A' + right('00' + convert(varchar(2), cast(right((@analise), 2) as int) + 1), 2)
            end
			print 'update'
			
			update PCP..oppcfLote set regTipo = 'T' where id_num = @id_num
    end
else 
	begin 
		print 'hhhh'
		print @qtdeReg
	end
close opProd
deallocate opProd


/*

if @qtdeLote > 0
    begin
        set @loteProx = (select max(lote) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote <> '000000000' having sum(qtde) < @quebraLote)
        set @analise = (select max(analise) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote <> '000000000' having sum(qtde) < @quebraLote)
        set @qtdeAnalise = (isnull((select sum(qtdeLote) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op), 0))
        set @saldoLote = @quebraLote - @qtdeLote
        if @saldoLote > 0
            begin 
                set @saldoAnalise = @quebraAnalise - (select qtdeAnalise from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise)
                
                if @saldoLote < @saldoAnalise
                    begin 
                        if @saldoLote < @qtdeLote
                            begin 
                                update PCP..oppcfLote set qtde = qtde + @saldoLote, qtdeLote = qtdeLote + @saldoLote, qtdeAnalise = qtdeAnalise + @saldoLote, regTipo = 'C'  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
                                set @qtdeReg = @qtdeReg - @saldoLote                                    
                                set @saldoLote = 0
                            end
                    end
                else
                    begin 
                        if @saldoAnalise < @qtdeLote
                            begin 
                                update PCP..oppcfLote set qtde = qtde + @saldoAnalise, qtdeLote = qtdeLote + @saldoAnalise, qtdeAnalise = qtdeAnalise + @saldoAnalise, regTipo = 'C'  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
                                set @qtdeReg = @qtdeReg - @saldoAnalise                                    
                                set @saldoAnalise = 0
                            end
                    end
                set @loteProx = right('000000000' + convert(varchar(9), cast(@loteProx as int) + 1), 9)
				set @analise = 'A01'
                while @qtdeReg > 0
                    begin 
                        if @qtdeReg > @quebraAnalise
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,           qtdeLote,       qtdeAnalise,    dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @quebraAnalise, @quebraAnalise, @quebraAnalise, dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'g',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                    
                                        set @qtdeReg = @qtdeReg - @quebraAnalise
                                        set @saldoLote = @saldoLote - @quebraAnalise
                            end
                        else
                            begin 
                                insert PCP..oppcfLote (filial, produto, op, idEv, qtde,     qtdeLote, qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
                                                select filial, produto, op, idEv, @qtdeReg, @qtdeReg, @qtdeReg,    dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'h',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                    
                                set @saldoLote = @saldoLote - @qtdeReg
                                set @qtdeReg = 0
                            end
                        if @saldoLote = 0
                            begin 
                                set @saldoLote = @quebraLote
                                set @loteProx = right('000000000' + convert(varchar(9), cast(@loteProx as int) + 1), 9)
                                set @analise = 'A01'
                            end
                                
                        set @analise = 'A' + right('00' + convert(varchar(2), cast(right((@analise), 2) as int) + 1), 2)
                                                                        
                        update PCP..oppcfLote set regTipo = 'T' where id_num = @id_num
                    end


                
            end
        else
            begin 
                set @saldoAnalise = @quebraAnalise - (select qtdeAnalise from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise)
                
                if @saldoLote < @saldoAnalise
                    begin 
                        if @saldoLote < @qtdeLote
                            begin 
                                update PCP..oppcfLote set qtde = qtde + @saldoLote, qtdeLote = qtdeLote + @saldoLote, qtdeAnalise = qtdeAnalise + @saldoLote, regTipo = 'C'  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
                                set @qtdeReg = @qtdeReg - @saldoLote                                    
                                set @saldoLote = 0
                            end
                    end
                else
                    begin 
                        if @saldoAnalise < @qtdeLote
                            begin 
                                update PCP..oppcfLote set qtde = qtde + @saldoAnalise, qtdeLote = qtdeLote + @saldoAnalise, qtdeAnalise = qtdeAnalise + @saldoAnalise, regTipo = 'C'  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
                                set @qtdeReg = @qtdeReg - @saldoAnalise                                    
                                set @saldoAnalise = 0
                            end
                    end
                
               
            end


    end
else
    begin 
	    set @loteEspec = (isnull((select loteAtual from PCP..qualEspecCab where cabProduto = @prod and situacao = 'Concluida'), '000000000'))
		set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @prod and lote <> '000000000'), '000000000'))
        set @loteProx = right('000000000' + convert(varchar(9), cast(case when @loteEspec >= @loteProduto then @loteEspec else @loteProduto end as int) + 1), 9)
		set @analise = 'A01'
                
        set @qtdeReg = @qtdes
        set @saldoLote = @quebraLote
        while @qtdeReg > 0
            begin 
                if @qtdeReg > @quebraAnalise
                    begin 
                        insert PCP..oppcfLote (filial, produto, op, idEv, qtde,           qtdeLote,       qtdeAnalise,    dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
		        		                select filial, produto, op, idEv, @quebraAnalise, @quebraAnalise, @quebraAnalise, dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'A',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                            
                        set @qtdeReg = @qtdeReg - @quebraAnalise
                        set @saldoLote = @saldoLote - @quebraAnalise
                    end
                else
                    begin 
                        insert PCP..oppcfLote (filial, produto, op, idEv, qtde,     qtdeLote, qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
		        		                select filial, produto, op, idEv, @qtdeReg, @qtdeReg, @qtdeReg,    dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'B',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                            
                        set @saldoLote = @saldoLote - @qtdeReg
                        set @qtdeReg = 0
                    end
                if @saldoLote = 0
                    begin 
                        set @saldoLote = @quebraLote
                        set @loteProx = right('000000000' + convert(varchar(9), cast(@loteProx as int) + 1), 9)
				        set @analise = 'A01'
                    end
						
                set @analise = 'A' + right('00' + convert(varchar(2), cast(right((@analise), 2) as int) + 1), 2)
                                                                
                update PCP..oppcfLote set regTipo = 'T' where id_num = @id_num
            end
    end




--spcp_cria_lote_12

-- set @conta = 0
-- set @qtdeReg = 0
-- set @analise = 'A01'

-- 	begin
-- 	    set @qtdeLote = (isnull((select sum(qtdeLote) from oppcfLote where filial = @fil and produto = @prod and op = @op and regTipo not in ('S', 'T')), 0))
--         if @qtdeLote = 0
--             begin 
-- 			    set @loteEspec = (isnull((select loteAtual from PCP..qualEspecCab where cabProduto = @prod and situacao = 'Concluida'), '000000000'))
-- 			    set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @prod and lote <> '000000000'), '000000000'))
--                 set @loteProx = right('000000000' + convert(varchar(9), cast(case when @loteEspec >= @loteProduto then @loteEspec else @loteProduto end as int) + 1), 9)
-- 				set @analise = 'A01'
                
--                 set @qtdeReg = @qtdes
--                 set @saldoLote = @quebraLote
--                 while @qtdeReg > 0
--                     begin 
--                         if @qtdeReg > @quebraAnalise
--                             begin 
--                                 insert PCP..oppcfLote (filial, produto, op, idEv, qtde,           qtdeLote,       qtdeAnalise,    dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
-- 		        				                select filial, produto, op, idEv, @quebraAnalise, @quebraAnalise, @quebraAnalise, dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'A',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                            
--                                 set @qtdeReg = @qtdeReg - @quebraAnalise
--                                 set @saldoLote = @saldoLote - @quebraAnalise
--                             end
--                         else
--                             begin 
--                                 insert PCP..oppcfLote (filial, produto, op, idEv, qtde,     qtdeLote, qtdeAnalise, dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
-- 		        				                select filial, produto, op, idEv, @qtdeReg, @qtdeReg, @qtdeReg,    dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'B',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                            
--                                 set @saldoLote = @saldoLote - @qtdeReg
--                                 set @qtdeReg = 0
--                             end
--                         if @saldoLote = 0
--                             begin 
--                                 set @saldoLote = @quebraLote
--                                 set @loteProx = right('000000000' + convert(varchar(9), cast(@loteProx as int) + 1), 9)
-- 				                set @analise = 'A01'
--                             end
						
--                     	set @analise = 'A' + right('00' + convert(varchar(2), cast(right((@analise), 2) as int) + 1), 2)
                                                                
--                     end 
--                 update PCP..oppcfLote set regTipo = 'T' where id_num = @id_num
--             end
--         else 
--             begin 

--                 set @qtdeReg = @qtdes

--                 set @loteProx = (select max(lote) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote <> '000000000' having sum(qtde) < @quebraLote)
--                 set @analise = (select max(analise) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote <> '000000000' having sum(qtde) < @quebraLote)
--                 set @saldoAnalise = @quebraAnalise - (select qtdeAnalise from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise)
--                 set @saldoLote = @quebraLote - (select sum(qtdeLote) from PCP..oppcfLote where filial = @fil and produto = @prod and op = @op and lote = @loteProx )
--                 set @qtdeInc = case when @saldoAnalise <= @saldoLote then @saldoAnalise else @saldoLote end
--                 while @qtdeReg > 0
--                     begin
--                         if @qtdeReg > @qtdeInc
--                             begin 
--                                 if @qtdeInc > 0
--                                     begin 
--                                         update PCP..oppcfLote set qtde = qtde + @qtdeInc, qtdeLote = qtdeLote + @qtdeInc, qtdeAnalise = qtdeAnalise + @qtdeInc  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
--                                         set @qtdeInc = 0
--                                         set @qtdeReg = @qtdeReg - @qtdeInc                                    
--                                     end 
--                                 else 
--                                     begin 
--                                         insert PCP..oppcfLote (filial, produto, op, idEv, qtde,           qtdeLote,       qtdeAnalise,    dtime, dtcria, situacao, codRecurso, lote,      origem, stsLote, analise,  loteAprov, qtdeQuebra, qtdeQuebraAnalise, regTipo, recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, loteEnv, qtdeProd)
-- 		        				                        select filial, produto, op, idEv, @quebraAnalise, @quebraAnalise, @quebraAnalise, dtime, dtcria, 'ABERTO', codRecurso, @loteProx, origem, stsLote, @analise, loteAprov, qtdeQuebra, qtdeQuebraAnalise, 'A',     recurso, codOpera, segundos, qtdeImp, intervaloLote, dtAprov, dtProd, dtVenc, quebra, usrAprovn1, usrAprovn2, usrAprovn3, dtAprovn1, dtAprovn2, dtAprovn3, intervalo, dataAprovacao, tipoAprova1, tipoAprova2, tipoAprova3, justificativa1, justificativa2, justificativa3, '', 0 from PCP..oppcfLote where id_num = @id_num
                                    
--                                         set @qtdeReg = @qtdeReg - @quebraAnalise
--                                         set @saldoLote = @saldoLote - @quebraAnalise
--                                     end
--                             end
--                         else
--                             begin 
--                                 update PCP..oppcfLote set qtde = qtde + @qtdeReg, qtdeLote = qtdeLote + @qtdeReg, qtdeAnalise = qtdeAnalise + @qtdeReg  where filial = @fil and produto = @prod and op = @op and lote = @loteProx and analise = @analise
--                                 set @qtdeReg = 0
--                             end
--                     end

                

--             end

     
--     end
--spcp_cria_lote_12



--spcp_cria_lote_12


/*
	while @qtdes > 0
		begin 
			set @loteEspec = (select loteAtual from PCP..qualEspecCab where cabProduto = @produto and situacao = 'Concluida')
			set @loteFilial = (isnull((select max(lote) from oppcfLote where filial = @filial and produto = @produto and lote <> '000000000'), '000000000'))
			set @loteProduto = (isnull((select max(lote) from oppcfLote where produto = @produto and lote <> '000000000'), '000000000'))
			if @loteFilial = '000000000'
				begin
					if @loteProduto = '000000000'
						begin
							set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
							
							if @qtdes > @qtdeQuebraA
								begin
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, max(op), 
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 , 'B'
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									set @qtdes = @qtdes - @qtdeQuebraA
									exec spcp_cria_lote_carac @filial, @produto, @lote, 'A01'
								end
							else
								begin
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, max(op),  
										@qtdes, @qtdes, @qtdes, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									set @qtdes = 0
									exec spcp_cria_lote_carac @filial, @produto, @lote, 'A01'
								end
						end
					else
						begin
							set @lote = right('000000000' + convert(varchar(9), cast(@loteProduto as int) + 1), 9)
							if @qtdes > @qtdeQuebraA
								begin
									insert PCP..oppcfLote (
										filial, produto, op,  
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, max(op),
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									set @qtdes = @qtdes - @qtdeQuebraA
									exec spcp_cria_lote_carac @filial, @produto, @lote, 'A01'
								end
							else
								begin
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										@filial, @produto, max(op), 
										@qtdes, @qtdes, @qtdes, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S' origem, ' ' stsLote, 
										'A01', 'ABERTO', @qtdeQuebraL, 
										@qtdeQuebraA, 
										max(recurso), max(codOpera), 0 segundos, 'L' regTipo
									from
										PCP..oppcfLote
									where
										regTipo = 'W'							
									group by
										origem, stsLote
									set @qtdes = 0
								end
						end
				end
			else
				begin
					set @qtdeLote = (isnull((select sum(qtdeLote) from PCP..oppcfLote where filial = @filial and op = @op and produto = @produto and lote = @loteFilial), 0))
					if @qtdeLote >= @qtdeQuebraL
						begin
							if @loteProduto >= @loteEspec
								begin 
									set @lote = right('000000000' + convert(varchar(9), cast(@loteProduto as int) + 1), 9)
								end
							else
								begin 
									set @lote = right('000000000' + convert(varchar(9), cast(@loteEspec as int) + 1), 9)
								end
							set @analise = 'A01'
						end
					else
						begin
							set @lote = @loteFilial
						end
					
					set @qtdeLote = (isnull((select sum(qtdeLote) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 0))
					set @saldoLote = @qtdeQuebraL - @qtdeLote
					if @qtdes > @saldoLote
						begin
							while @saldoLote > 0
								begin
									if @saldoLote > @qtdeQuebraA
										begin 
											set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
											insert PCP..oppcfLote (
												filial, produto, op, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, situacao, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, qtdeQuebra, 
												qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												filial, produto, max(op), 
												@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
												max(dtime), max(dtcria), max(situacao), 
												max(codRecurso), @lote, 
												'S', ' ', 
												@analise, 'ABERTO', qtdeQuebra, 
												qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'C' regTipo
											from
												PCP..oppcfLote
											where
												1 = 1
												and filial = @filial
												and op = @op
												and produto = @produto
												and lote = '000000000'
											group by
												filial, produto, qtdeQuebra, qtdeQuebraAnalise
											set @qtdes = @qtdes - @qtdeQuebraA
											set @saldoLote = @saldoLote - @qtdeQuebraA
											exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
										end
									else
										begin 
											set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
											insert PCP..oppcfLote (
												filial, produto, op, 
												qtde, qtdeLote, qtdeAnalise, 
												dtime, dtcria, situacao, 
												codRecurso, lote, 
												origem, stsLote, 
												analise, loteAprov, qtdeQuebra, 
												qtdeQuebraAnalise, 
												recurso, codOpera, segundos, regTipo)
											select distinct
												filial, produto, max(op),
												@saldoLote, @saldoLote, @saldoLote, 
												max(dtime), max(dtcria), max(situacao), 
												max(codRecurso), @lote, 
												'S', ' ', 
												@analise, 'ABERTO', qtdeQuebra, 
												qtdeQuebraAnalise, 
												max(recurso), max(codOpera), 0 segundos, 'D' regTipo
											from
												PCP..oppcfLote
											where
												1 = 1
												and filial = @filial
												and op = @op
												and produto = @produto
												and lote = '000000000'
											group by
												filial, produto, qtdeQuebra, qtdeQuebraAnalise
											set @qtdes = @qtdes - @saldoLote
											set @saldoLote = 0
											exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
										end
								end 
							end 
					else
						begin
							if @qtdes > @qtdeQuebraA
								begin 
									set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
									--set @analise = 'A' + right('00' + convert(varchar(2), cast(right((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteProduto), 2) as int) + 1), 2)
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										filial, produto, max(op),
										@qtdeQuebraA, @qtdeQuebraA, @qtdeQuebraA, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S', ' ', 
										@analise, 'ABERTO', qtdeQuebra, 
										qtdeQuebraAnalise, 
										max(recurso), max(codOpera), 0 segundos, 'E' regTipo
									from
										PCP..oppcfLote
									where
										1 = 1
										and filial = @filial
										and op = @op
										and produto = @produto
										and lote = '000000000'
									group by
										filial, produto, qtdeQuebra, qtdeQuebraAnalise
									set @qtdes = @qtdes - @qtdeQuebraA
									exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
								end
							else
								begin 
									set @analise = 'A' + right('00' + convert(varchar(2), cast(right((isnull((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @lote), 'A00')), 2) as int) + 1), 2)
									--set @analise = 'A' + right('00' + convert(varchar(2), cast(right((select max(analise) from PCP..oppcfLote where filial = @filial and produto = @produto and lote = @loteProduto), 2) as int) + 1), 2)
									insert PCP..oppcfLote (
										filial, produto, op, 
										qtde, qtdeLote, qtdeAnalise, 
										dtime, dtcria, situacao, 
										codRecurso, lote, 
										origem, stsLote, 
										analise, loteAprov, qtdeQuebra, 
										qtdeQuebraAnalise, 
										recurso, codOpera, segundos, regTipo)
									select distinct
										filial, produto, max(op), 
										@qtdes, @qtdes, @qtdes, 
										max(dtime), max(dtcria), max(situacao), 
										max(codRecurso), @lote, 
										'S', ' ', 
										@analise, 'ABERTO', qtdeQuebra, 
										qtdeQuebraAnalise, 
										max(recurso), max(codOpera), 0 segundos, 'F' regTipo
									from
										PCP..oppcfLote
									where
										1 = 1
										and filial = @filial
										and op = @op
										and produto = @produto
										and lote = '000000000'
									group by
										filial, produto, qtdeQuebra, qtdeQuebraAnalise
									set @qtdes = 0
									exec spcp_cria_lote_carac @filial, @produto, @lote, @analise
								end
						end
				end
		end
		update
			oppcfLote
		set
			regTipo = 'T'
		where
			1 = 1
			and filial = @filial
			and op = @op
			and produto = @produto
			and lote = '000000000'
			and regTipo = 'W'

*/


/*
declare opProd cursor for
	select
		id_num, a.filial, a.produto, a.lote, loteAprov, 
		qtdeLote, qtdeQuebra, analise, qtdeAnalise, 
		qtdeQuebraAnalise, regTipo
	from
		oppcfLote a inner join
		(
			select distinct
				filial, produto, lote
			from
				oppcfLote
			where
				loteAprov = 'ABERTO'		
		) b on
		a.filial = b.filial 
		and a.produto = b.produto
		and a.lote = b.lote inner join
		(
			select 
				filial, produto, lote, sum(qtdeLote) qtdelote, max(qtdeQuebra) qtdequebra
			from 
				oppcfLote
			group by 
				filial, produto, lote
			having 
				sum(qtdeLote)<max(qtdeQuebra) 
		) c on
		a.filial = c.filial 
		and a.produto = c.produto
		and a.lote = c.lote
	where
		1 = 1
		--and a.filial = '108'
		and a.filial = @filial
		and a.op = @op
		--and a.produto = 'PAN00775'
		and a.produto = @produto
		and a.lote > '000000000'
		--and regTipo not in ('T', 'x', 'S')
	order by
		a.lote

open opProd
fetch next from opProd   
into @id_num, @fil, @prod, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo

--spcp_cria_lote_11
while @@FETCH_STATUS = 0
	begin
		set @loteAnt = @lote
		set @saldoLote = @saldoLote + @qtdeLote
		if @loteAprov <> 'ABERTO'
			begin
				set @qtdes = @qtdes - @qtdeLote
			end
		else 
			begin
				set @saldoAnalise = @qtdeQuebraAnalise - @qtdeAnalise
				if @saldoAnalise > 0 and @saldoLote < @qtdeQuebra 
					begin 
						if @qtdes >= @saldoAnalise
							begin
								update PCP..oppcfLote set qtde = qtde + @saldoAnalise, qtdeLote = qtdeLote + @saldoAnalise, qtdeAnalise = qtdeAnalise + @saldoAnalise, qtdeImp = 5 where id_num = @id_num
								set @qtdes = @qtdes - (@qtdeQuebraAnalise - @qtdeAnalise)
							end
						else
							begin 
								update PCP..oppcfLote set qtde = qtde + @qtdes, qtdeLote = qtdeLote + @qtdes, qtdeAnalise = qtdeAnalise + @qtdes, qtdeImp = 5 where id_num = @id_num
								set @qtdes = 0
							end
					end 
			end
		
		fetch next from opProd   
		into @id_num, @fil, @prod, @lote, @loteAprov, @qtdeLote, @qtdeQuebra, @analise, @qtdeAnalise, @qtdeQuebraAnalise, @regTipo
		if @loteAnt <> @lote
			begin
				set @saldoLote = 0
			end
	end
*/
*/
GO
