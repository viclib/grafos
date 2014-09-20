1º Trabalho de Grafos
=========
### Patrícia de Andrade Kovaleski e Victor Hernandes Silva Maia
___
* Linguagem utilizada para implementação da biblioteca de grafos: __javascript__
___

Estudos de Caso
---
###1º Caso: Memória utilizada
|               | Matriz de Adjacência | Vetor de Adjacência |
|:-------------:|:-------------:|:-----:|
| __as_graph__  | 19.7 MB | 16.9 MB |
| __subdblp__   | 279.7 MB | 66.2 MB |
| __dblp__      | --- | 392.9 MB |

Não foi possível criar a matriz de adjacência para o grafo dblp.txt no computador utilizado. Teoricamente ela utilizaria aproximadamente 113.68GB tendo em vista que são 1397510 vértices.
###2º Caso: Tempo de execução de 10 BFS's
|               | Matriz de Adjacência | Vetor de Adjacência |
|:-------------:|:-------------:|:-----:|
| __as_graph__  | 435.284 s | 0.033 s |
| __subdblp__   | ??? s | 0.222 s |
| __dblp__      | --- | 4.894 s | 
###3º Caso: Tempo de execução de 10 DFS's
|               | Matriz de Adjacência | Vetor de Adjacência |
|:-------------:|:-------------:|:-----:|
| __as_graph__  | 432.177 s | 0.018 s |
| __subdblp__   |??? s | 0.296 s |
| __dblp__      | --- | 7.496 s | 

Para otimizarmos a matriz de adjacência poderíamos utilizar um cache dos vizinhos de cada vértice da matriz; que nada mais seria do que um vetor de adjacência. Acreditamos, porém, que isto acabaria com o propósito de comparação entre as estruturas. Preferimos, portanto, manter a versão não-otimizada. 

###4º Caso: Obtendo o pai dos vértices
####as_graph:
- BFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__                 | 1 | 1 | 1 | 1 | 1 |
| __2__                 | 2 | 10 | 35 | 2 | 35 |
| __3__                 | 3 | 1 | 1 | 1 | 1 | 
| __4__                 | 4 | 10 | 5573 | 6458 | 27 | 
| __5__                 | 5 | 5 | 8 | 2 | 5 | 

- DFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__                 | 3 | 3606 | 1945 | 9722 | 102 |
| __2__                 | 3 | 247 | 1258 | 9722 | 102 |
| __3__                 | 6 | 37 | 1258 | 2293 | 2693 | 
| __4__                 | 4 | 44 | 1258 | 9722 | 102 | 
| __5__                 | 3 | 37 | 1258 | 2293 | 2693 | 

####subdblp:
- BFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__                 | 1 | 1 | 1 | 2 | 2 |
| __2__                 | 1 | 1 | 1 | 2 | 2 |
| __3__                 | 1 | 1 | 1 | 2 | 2 | 
| __4__                 | 1 | 1 | 1 | 2 | 2 | 
| __5__                 | 5 | 1 | 1 | 2 | 2 | 

- DFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__                 | 428 | 914 | 1102 | 1643 | 21 |
| __2__                 | 428 | 914 | 1102 | 1643 | 21 |
| __3__                 | 428 | 914 | 1095 | 1643 | 21 | 
| __4__                 | 428 | 914 | 1095 | 1643 | 21 | 
| __5__                 | 428 | 917 | 1102 | 1643 | 21 | 

####dblp:
- BFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__ | 1226753 | 843078 | 80251 | 1039901 | 291354 |
| __2__ | 1226753 | 843078 | 367956 | 1009777 | 766662 |
| __3__ | 1226753 | 843078 | 367956 | 1009777 | 766662 |
| __4__ | 1226753 | 843078 | 367956 | 1009777 | 766662 |
| __5__ | 1226753 | 843078 | 367956 | 1009777 | 766662 |

- DFS

|Vértice inicial/Vértice|  10  |  20  |  30  |  40  |  50  |
|:---------------------:|:----:|:----:|:----:|:----:|:----:|
| __1__ | 1226753 | 843078 | 80251 | 325983 | 291354 |
| __2__ | 1226753 | 762595 | 80251 | 325983 | 291354 |
| __3__ | 1226753 | 762595 | 80251 | 325983 | 291354 |
| __4__ | 1226753 | 762595 | 80251 | 325983 | 291354 |
| __5__ | 1226753 | 762595 | 80251 | 325983 | 291354 |


###5º Caso: Componentes conexas
####as_graph:
- Total de componentes conexas: 1
- Maior componente conexa: 32385 
- Menor componente conexa: 32385


####subdblp:
- Total de componentes conexas: 10
- Maior componente conexa: 100001
- Menor componente conexa: 2


####dblp:
- Total de componentes conexas: 116442
- Maior componente conexa: 1183247
- Menor componente conexa: 1


###6º Caso: Grau dos vértices
####as_graph:
- Maior grau do grafo: 2161
- Menor grau do grafo: 1
```javascript
GRAFICO DA DIST. EMP. DOS GRAUS
```

####subdblp:
- Maior grau do grafo: 1035
- Menor grau do grafo: 1
```javascript
GRAFICO DA DIST. EMP. DOS GRAUS
```

####dblp:
- Maior grau do grafo: 1638
- Menor grau do grafo: 0
```javascript
GRAFICO DA DIST. EMP. DOS GRAUS
```


###7º Caso: Diâmetro do grafo
####as_graph:
- Diâmetro do grafo:
```javascript
output do diâmetro
```
- Tempo de execução:

####subdblp:
- Diâmetro do grafo:
```javascript
output do diâmetro
```
- Tempo de execução:

####dblp:
- Diâmetro do grafo:
```javascript
output do diâmetro
```
- Tempo de execução:



___
Universidade Federal do Rio de Janeiro - UFRJ

Teoria dos Grafos

2014/2







