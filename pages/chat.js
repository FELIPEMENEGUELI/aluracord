import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {useRouter} from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NDA3NjU3NSwiZXhwIjoxOTU5NjUyNTc1fQ.Zqh_ictWaU3Nn-CHR6G3zHcUNupu6_aAreQ0PQeNJGQ';
const SUPABASE_URL = 'https://jbbhftkoumlovpbeppxu.supabase.co';
const supababaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// fetch('${SUPABASE_URL}/rest/v1)/messages?select=*', { 
// 	headers: {
// 		'Content-Tyoe': 'application/json',
// 		'apikey': supabaseAnonKey,
// 		'Authorization': 'Bearer ' + supabaseAnKey,
// 	}
// })

// .then((res) => { 
// 	return res.json();
// })

// .then((response) = > {
// 	console.log(response);
// });


// Sua lógica vai aqui
/*
//Usuario
- Usuario digita no campo textarea
- Aperta entrar para enviar
- Tem que adicionar texto na mensagem

//Dev
- Campo criado
- Usar onChange para usar o useState (ter if pra caso seja o enter pra limpar a variavel)
- Lista de mensagens   
*/
// ./Sua lógica vai aqui
export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    // console.log('usuarioLogado', usuarioLogado)
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([
        // {
        //     id: 1,
        //     de: 'FelipeMenegueli',
        //     texto: ':sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_3.png'
        // }
    ]);

    function escutaMensagensEmTempoReal(adicionaMensagem){
        return supababaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) =>{
            adicionaMensagem(respostaLive.new);

        }).subscribe();
    }


    React.useEffect(() =>{
        const dadosdoSupabase = supababaseClient
        .from('mensagens')
        .select('*')
        .order('id', {ascending: false })
        .then(({data}) =>{
            console.log('Dados da tabela', data)
            setListaDeMensagens(data);
        });

        escutaMensagensEmTempoReal((novaMensagem) =>{   
            // handleNovaMensagem(novaMensagem)
            setListaDeMensagens((valorAtualDaLista) =>{
                 return[
                     novaMensagem,
                     ...valorAtualDaLista,
                 ]
            });
        });
    }, []);

        
    function handleNovaMensagem(novaMensagem){
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem, 
        };

        supababaseClient
        .from('mensagens')
        .insert([
            mensagem
        ])
        .then(({data}) => {
            // setListaDeMensagens([
            //     data[0],
            //     ...listaDeMensagens,
            // ])
        });

        setMensagem('');
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                // backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/jaguar-f-type-drivers-seat.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '10px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '80%',
                    maxWidth: '80%',
                    maxHeight: '80vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} />
                    {/* {listaDeMensagens.map((mensagemAtual) =>{
                        return(
                            <li key={mensagemAtual.id}>
                                    {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) =>{
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) =>{
                                if(event.key === 'Enter'){
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* Call Back */}
                         <ButtonSendSticker 
                         onStickerClick={()=>{
                            handleNovaMensagem(':sticker:' , sticker)
                         }}
                         />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return(
            <Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >
                <Box
                    styleSheet={{
                        marginBottom: '8px',
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                    />
                    <Text tag="strong">
                        {mensagem.de}
                    </Text>
                    <Text
                        styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                {/* Declarativo */}
                    {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                    {mensagem.texto.startsWith(':sticker:')
                    ? (
                        <Image src={mensagem.texto.replace(':sticker:', '')} />
                    )
                    : (
                        mensagem.texto
                    )}

                {/* {mensagem.texto} */}
            </Text>
                );
            })}
        </Box>
    )
}