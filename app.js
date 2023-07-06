var uri = 'http://200.144.255.35:8080/springboot/produtos'
var idEditar = '';
var idExcluir = '';

// Função executada automaticamente ao carregar a página
$(function () {
    carregarProdutos()
});

// Exibe os registros
function carregarProdutos() {
    var consulta = $('#pesquisa').val()

    if(consulta == '' || consulta == undefined){
        $.get(uri, function (produtos) {
            montarTabelaProduto(produtos)

        })
    }else{
        $.get(uri + '/p/' + consulta, function (produtos) {
            montarTabelaProduto(produtos)
        })
    }

}

    

function montarTabelaProduto(produtos){
    $('#tabelaProdutos>tbody>tr').remove()

    for (i = 0; i < produtos.length; i++) {
        linha = montarLinhaProduto(produtos[i])
        $('#tabelaProdutos>tbody').append(linha)
    }
}

function montarLinhaProduto(produto) {
    var linha = '<tr>' +
        '<td id="id-produto">' + produto.idProduto + '</td>' +
        '<td id="nome-produto">' + produto.nome + '</td>' +
        '<td id="valor-produto">' + produto.valor + '</td>' +
        '<td><button data-bs-toggle="modal" data-bs-target="#modalCadastroProduto" class="btn btn-warning btn-sm" onclick="editarProduto(' + produto.idProduto + ')">Editar</button></td>' +
        '<td><button data-bs-toggle="modal" data-bs-target="#modalExclusao" class="btn btn-danger btn-sm" onclick="setIdExcluir(' + produto.idProduto +')">Apagar</button></td>' +
        '</tr>'
    return linha
}

function novoProduto(){
    idEditar = '';
    $('#produto').val('')
    $('#valor').val('')
    $('#idProduto').val('')
}

function criarProduto() {
    produto = {
        nome: $('#nome').val(),
        valor: $('#valor').val()
    }

    $.ajax({
        type: "POST",
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(produto), // converte um valor para uma notação JSON
        success: function (response) {
            carregarProdutos()
            //alert('Registro incluído com sucesso')
            $('#modalInseridoSucesso').modal('show');
        },
        error: function (erro) {
            //alert('Falha na inclusão do registro')
            $('#modalInseridoFalha').modal('show');
        }
    })
}

function editarProduto(id){
    $.get(uri + '/' + id, function(produto){
        idEditar = id
        $('#nome').val(produto.nome)
        $('#valor').val(produto.valor)
    })
}

function gravarProduto(){
    if(idEditar == ''){
        criarProduto()
    } else{
        salvarProduto()
    }
}

function salvarProduto(){
    produto = {
        id: idEditar,
        nome: $('#nome').val(),
        valor: $('#valor').val(),
    }
    console.log(produto)

    $.ajax({
        type: "PUT",
        url: uri + '/' + idEditar,
        contentType: 'application/json',
        data: JSON.stringify(produto),
        success: function(response) {
            carregarProdutos()
            //alert('Registro alterado com sucesso')
            $('#modalAlteradoSucesso').modal('show');
        },
        error: function (erro) {
            //alert('Falha na alteração do registro')
            $('#modalAlteradoFalha').modal('show');
        }
    })
}

function setIdExcluir(id){
    idExcluir = id
}

function excluirProduto(){
    $.ajax({
        type: "DELETE",
        url: uri + '/' + idExcluir,
        success: function(){
            //alert('Registro excluído com sucesso!')
            carregarProdutos()
            $('#modalExcluidoSucesso').modal('show');
        },
        error: function(erro){
            //alert('Falha na exclusão do produto!')
            $('modalExcluidoFalha').modal('show');
        }
    })
}

//limpar a pesquisa
function limpar(){
    $('#pesquisa').val('')
    carregarProdutos()
}