
# [Todobit](https://www.todobit.com.br) - Exercício de desenvolvimento web


## Requisitos funcionais

Criar uma tela que cadastre todas as 32 seleções da copa do mundo, os dados necessários
são: Nome (nome do país), Grupo (letra de A até H) e Continente.

Será necessário: 
 - Registrar, atualizar, deletar e pesquisar equipe (por nome);
 - Validar o registro para não permitir que nenhum campo seja salvo vazio;
 - Não permitir que mais de 32 times sejam cadastrados;
 - Funcionar em todos os browsers modernos;

Não será necessário: 
 - Estilos CSS (a não ser que a falta dele comprometa o uso);
 - Implementar login ou autenticação;


## Requisitos não funcionais

O sistema deverá ser implementado na plataforma web, utilizando qualquer versão do Javascript, HTML e CSS (se necessário) no frontend. A linguagem PHP será utilizada no backend (versão 5.4 ou superior).

A persistência dos dados pode ser feita por qualquer tecnologia não proprietária. Podem ser utilizados bancos de dados SQL, NoSQL, persistência em arquivos binários ou de texto.

A estrutura de arquivos a ser utilizada deve ser a mesma desse repositório. Na parte PHP do projeto, podem ser utilizados quaisquer frameworks ou libs que melhor lhe convir. 

Já no frontend, não deve ser utilizado nenhuma lib ou framework externo. Nesse caso, pode ser feito uso de qualquer versão atual do Javascript, HTML ou CSS.


# Entrega

O prazo de entrega será aquele acordado previamente com o responsável que ministra o curso, treinamento ou recrutamento. 

A entrega deve ser feita por meio de um pull-request nesse repositório.

# Como rodar composer

$ cd backend/

$ docker-compose run composer

# Levantar o servidor back end

$ docker-compose up -d


# Como rodar as migrações

$ docker-compose run php7 php ./vendor/bin/phinx migrate

# CRUD Rotas

## Save Method

* Method: POST
* Url: http://localhost/save
* POST Body: ```{ "name": "Brasil", "grupo": "1", "continente": "América" }```

## Delete Method

* Method: DELETE
* Url: http://localhost/delete/{equipe_id}

## Search Method

* Method: GET
* Url: http://localhost/search/{equipe_name}
* Response Format: JSON
* Response Data: ```{"code":200,"message":[{"id":6,"name":"Brasil","continente":"América","grupo_id":12}]}```

## List Method

* Method: GET
* Url: http://localhost/list
* Response Format: JSON
* Response Data: ```{"code":200,"message":[{"id":6,"name":"Brasil","continente":"América","grupo_id":12}, {"id":6,"name":"Argentina","continente":"América","grupo_id":10}]}```