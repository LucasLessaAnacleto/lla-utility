# lla-utility
lla-utility é um pacote de funções utilitárias para utilizar em javascript e typescript. eu criei esse pacote para eu poder utilizar minhas próprias soluções de uma forma mais convencional, ao invés de ficar procurando nos meus outros projetos e adicionar o arquivo com a funcionalidade diretamente no projeto.

## Instalação

Para utilizar alguma funcionalidade do **lla-utility**, você deve instalar com **npm**
```cmd
npm install lla-utility
``` 

## Funcionalidades

Aqui está a lista de todas as funcionalidades disponíveis no pacote.

- [formatDateAgo](#formatdateago)

## formatDateAgo

Essa função é uma utilidade que converte uma data fornecida em um Date ou string representando o tempo decorrido, desde essa data do parâmetro até o momento atual, em termos humanos, como "2 dias atrás" ou "1 mês atrás".

### Exemplo de uso
```ts
import { formatDateAgo } from 'lla-utility';

const formattedDate = formatDateAgo('2024-01-13T12:00:00Z');
console.log(formattedDate); // Saída esperada: "4 meses atrás"
```
Ele retornará uma string dizendo quanto tempo atrás foi a data recebida pelo o parâmetro em relacão ao momento atual. 

# lla-utility/react
lla-utility/react é um mini pacote de funções utilitárias para utilizar em projetos React, essas são soluções que já existe no universo React, mas que eu quis criar minhas próprias implementações e que são úteis em várias aplicações React.

Certifique-se de ter o React instalado em seu projeto, pois lla-utility/react depende do React como uma peerDependency.

## Funcionalidades

Aqui está a lista de todas as funcionalidades disponíveis no pacote.

- [useDebounce](#usedebounce)
- [useUrlState](#useurlstate)
- [useRouterDom](#userouterdom)
- [getLinkRouterDom](#getlinkrouterdom)

## useDebounce

A função **useDebounce** é um hook personalizado que permite atrasar a execução de uma determinada função até que um certo tempo tenha passado desde a última vez que a função foi chamada. Isso é útil em situações onde você deseja aguardar que o usuário termine de digitar em um campo de entrada, por exemplo, antes de realizar uma operação que consome recursos.

### Parâmetros

- **callback**: Uma função que será executada após o atraso especificado.

- **delay**: O tempo, em milissegundos, pelo qual a execução da função será atrasada. Se não for fornecido, o valor padrão é 1500 milissegundos (1.5 segundos).

### Retorno

O retorno é a função que executará o callback passado no primeiro paramêtro do useDebounce, toda vez que ele é chamado, ele agenda a execução do callback para o intervalo de tempo determinado no segundo parâmetro do useDebounce, e cada vez que ele é chamado, ele cancela o agendamento passado (se houver) e agenda um novo, fazendo com que atrasamento seja efetuado.

### Exemplo de uso
```ts
import React from 'react';
import { useDebounce } from 'lla-utility/react';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Definindo uma função de busca que será chamada após um atraso de 500ms
  const debouncedSearch = useDebounce<string>((term: string) => {
    console.log('Realizando busca por:', term);
    // Coloque aqui a lógica para realizar a busca
  }, 500);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    
    // Chamando a função debounced para realizar a busca após o atraso
    debouncedSearch(term);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Digite sua busca..."
    />
  );
};

export default SearchBar;
```
Esse é um exemplo comum utilizando a funcionalidade do debounce, que é para pesquisas. O useDebounce é usado para criar uma função debouncedSearch que será chamada após um atraso de 500 milissegundos a partir do último evento de onChange no campo de entrada. Isso evita que a função de busca seja executada a cada alteração no campo de entrada, o que pode ser custoso em termos de desempenho.

Ao utilizar o typescript, é importante definir o tipo genérico na função useDebounce, esse tipo será utilizado para o argumento da função de retorno.

## useUrlState

A função **useUrlState** é um hook personalizado que permite sincronizar o estado de um componente React com um parâmetro de URL. Isso é útil quando você deseja manter o estado do aplicativo sincronizado com a barra de endereços do navegador, por exemplo, ao compartilhar links ou ao navegar pelas páginas do aplicativo.

### Parâmetros

- **param**: O nome do parâmetro da URL que será sincronizado com o estado do componente.

- **initial**: O valor inicial do estado.

- **strToType**: Uma função que converte uma string do parâmetro da URL de volta para o tipo genérico passado na função useUrlState.

- **typeToStr**: Uma função opcional que converte o estado para uma string que será armazenada no parâmetro da URL. Se não for fornecida, a função padrão será usar String() para converter o valor.

### Retorno

O retorno é um array contendo 3 elementos, sendo o último opcional.

1. **state**: O estado que armazena o valor do paramêtro da URL, pode ser usado exatamente como o estado do react.

2. **setCurrentState**: É a função que vai atualizar o valor no parâmetro da URL e ao mesmo tempo atualizar o estado do 'state'.

3. **hiddenState**: É uma função opcional, ele basicamente oculta o parâmetro na URL, o que pode ser útil dependendo a situação.

### Exemplo de uso
```ts
import React from 'react';
import { useUrlState } from 'lla-utility/react';

function App() {
  // Sincronizando o estado 'count' com o parâmetro 'count' da URL
  const [count, setCount, hideCount] = useUrlState<number>('count', 0, parseInt);
  
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  // Oculta o paramêtro na URL caso seu valor seja 0
  if(count === 0) hideCount();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;
```
Esse é apenas um exemplo, utilizando um contador que guarda a contagem atual na URL, ou seja, mesmo se recarregar a página ou compartilhar o link, a contagem vai permanecer a mesma.

Neste exemplo, o estado count é sincronizado com o parâmetro count da URL usando a função useUrlState. O estado é inicializado como 0, e a função parseInt é usada para converter a string do parâmetro da URL de volta para um número.

O uso do tipo genérico nesta função é de extrema importância, para determinar o tipo do seu parâmetro de URL.

## useRouterDom

A função useRouterDom é um hook personalizado que facilita o roteamento dinâmico em um aplicativo React. Ele gerencia a URL do navegador e renderiza o componente apropriado com base na rota atual. Ele serve para fazer a 'troca de página' no react.

### Parâmetros

- **pathInitial**: Uma string opcional que especifica o caminho da URL inicial. Se não for fornecido, o caminho inicial será '/'.

### Retorno

O retorno é um array contendo três elementos, sendo o último opcional.

1. **Router**: Um componente funcional React que renderiza o componente correspondente à rota atual.

2. **setRouter**: Uma função que permite alterar a rota, fazendo com que o 'Router' leie essa alteração e renderize o componente conforme a URL atual.

3. **pathRouter**: O estado react com o caminho atual da URL.

### Como funciona o elemento Router

O elemento Router desempenha um papel para que ocorra um navegação dinâmica, sem que precise recarregar a página por completo. Ele permite a renderização condicional de componentes com base na URL atual do navegador. 

As props são necessários passar para esse elemento.

- **configRouters**: Um array de objetos que define as rotas e os componentes associados a elas. Cada objeto de rota tem as seguintes propriedades:

  - **path:** O caminho da URL que a rota deve corresponder.

  - **element:** É a função que retorna o HTML daquele elemento, no caso o componente React mas sem utilizar a sintaxe JSX, pois essa responsabilidade será do próprio Router. Ela irá ser renderizado quando a rota corresponder à URL atual.

  - **setRouter (opcional):** O próprio 'setRouter'

  - **hasRouteParam (opcional):** Um booleano que indica se a rota possui parâmetros de rota.

  - **props (opcional):** Propriedades adicionais a serem passadas para o componente renderizado.

### Exemplo de uso
```ts
import React from "react";
import { useRouterDom } from 'lla-utility/react';
import { SideBar } from './nav-bar';
import { Header } from './header';
import { Home } from './home';
import { UserProfile } from './user-profile';
import { NotFound } from './not-found';

function App() {
  const [Router, setPath, path] = useRouterDom("/");

  return (
    <>
      <SideBar setRouter={setPath}/>
      <div class="container">
        <Header title={path === "/" ? "Home" : path.includes("/user/") ? "Profile" : "Not Found"}/>
        <main>
          <Router  
            configRouters={[
              {
                path: "/",
                element: Home,
                setRouter: setPath
              },
              {
                path: "/user/:userID", 
                element: UserProfile,
                setRouter: setPath, 
                hasRouteParam: true
              },
              {
                path: "?",
                element: NotFound, 
                props: { path }    
              }
          ]} />
        </main>
      </div>
    </>
  )
}

export default App;
```
É um exemplo genérico da utilização do **useRouterDom** em uma aplicação React. Neste exemplo, dá para ver o uso dos 3 itens do array retornados pelo o useRouterDom, explicação de cada um de acordo com a ordem.

**Router**

O Router foi utilizado dentro da tag main, pois nesse exemplo em questão, estamos considerando que antes disso, a página basicamente não muda, então o local onde utilizar o elemento de roteamento, pode trazer mais performance se pensado com inteligência onde realmente minha aplicação irá mudar realmente. 

O Router necessita da props configRouters. Ela espera um array de objetos para a configuração das rotas. 

O primeiro objeto do array está configurando para que o elemento Home será renderizado quando o caminho da URL atual for "/", o 'setRouter' também foi passado pois o Home irá precisar alterar rotas dentro do componente. 

O segundo objeto, configura para que quando o caminho for "/user/:userID" o componente UserProfile será renderizado, e o setRouter também foi passado nesse caso, o hasRouterParam precisa ser setado como true para que o Router entenda que o 'path' possui parâmetros de rotas, nesse caso o componente UserProfile será renderizado com uma props chamada 'routeParams' que o próprio Router passa para componentes com parâmetros de rotas, é um objeto contendo todos os parâmetros e seus valores, nesse exemplos o UserProfile receberá a props routerParams com o objeto { userID: "valor" }.

O terceiro objeto, configura para que quando a URL não for nenhuma das rotas defindas renderizar o componente NotFound de página não encontrada. Isso é feito quando o path for "?" uma interrogação, também é passado o path (terceiro item retornado do useRouterDom) como props, o Router passa para o elemento todos os atributos da props.

**setPath**

Nesse exemplo em questão, o setPath só foi utilizado dentro dos outros componentes como o SideBar, Home e UserProfile. Mas ele basicamente alterna as rotas, por exemplo 'setPath("/user/123")', que irá alterar o caminho da url e o Router irá renderizar o componente UserProfile passando o objeto {userID: "123"} na props routerParams.

**path**

É basicamente um estado do React com o valor atual do caminho da URL. Nesse exemplo, é utilizado na realização de um if ternário da props title do componente Header, caso o caminho atual for "/" title terá o valor de "Home", se conter a rota "/user/" title será "Profile", caso o contrário será "Not Found".

## getLinkRouterDom

A função **getLinkRouterDom** é responsável por retornar um componente de link, uma âncora normal mas que permite a navegação dentro da aplicação React usando em conjunto com o **useRouterDom**. Esse componente de link recebe um destino (to) e, quando clicado, atualiza a rota da aplicação para o destino fornecido.

### Parâmetros

- **setRouter**: Uma função que permite alterar a rota da aplicação e o conteúdo da página. Essa função é fornecida pelo hook personalizado useRouterDom.

### Retorno

A função getLinkRouterDom retorna um componente React de link que, quando clicado, atualiza a rota da aplicação para o destino especificado (se tiver um Router na sua aplicação).

### Props do Componente Link

- **to**: O destino para onde o link irá navegar. Pode ser uma string representando o caminho da rota ou null se não houver um destino definido.

- **children**: Os elementos filhos do componente de link, que podem ser qualquer conteúdo React.

### Exemplo de uso
```ts
import React from 'react';
import { useRouterDom, getLinkRouterDom, SetRouterType } from 'lla-utility/react';
import Logo from '../assets/logo.svg';

interface HeaderProps {
  setRouter: SetRouterType
}

function Header(props: HeaderProps) {
  // Obtendo o componente de link
  const Link = getLinkRouterDom(props.setRouter);
  
  Return (
    <div class="header">
      <img src={Logo} alt="Logo" />

      <div class="navbar">
        // Usando o componente de link
        <Link to="/all-courses">Todos os nossos cursos</Link>
        <Link to="/my-courses">Meus cursos</Linl>
        <Link to="/about">Sobre nós</Link>
        <Link to="/contact">Nossos contatos</Link>
      </div>
    </div>
  )
}

export default Header;
```
Esse é um exemplo básico de como utilizar o getLinkRouterDom. Nesse exemplo o componente Header recebe o setRouter pelo o props, que é necessário passar como parâmetro da função. Depois disso os links foram utilizados definindo a props **to** com a rota específico que deseja que a aplicação seja redirecionada, ao clicar no Link. Esse componente pode receber qualquer propriedade que a tag **\<a>** receberia. 