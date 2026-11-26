import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const HEROES_URL = 'https://superheroes-api-one.vercel.app/api/herois';

export default function Home() {
  const [herois, setHerois] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [recarregamentos, setRecarregamentos] = useState(0);

  useEffect(() => {
    let ativo = true;

    const carregaHerois = async () => {
      try {
        const resposta = await fetch(HEROES_URL);
        if (!resposta.ok) {
          throw new Error('Não foi possível buscar os heróis.');
        }

        const dados = await resposta.json();
        const lista = Array.isArray(dados) ? dados : dados?.herois;
        if (!Array.isArray(lista)) {
          throw new Error('A resposta recebida não contém uma lista de heróis.');
        }

        if (ativo) {
          setHerois(lista);
        }
      } catch (falha) {
        if (ativo) {
          setErro(falha instanceof Error ? falha.message : 'Ocorreu um erro inesperado.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregaHerois();

    return () => {
      ativo = false;
    };
  }, [recarregamentos]);

  const tentaNovamente = () => {
    setCarregando(true);
    setErro(null);
    setRecarregamentos((quantidade) => quantidade + 1);
  };

  const renderizaHeroi = ({ item }) => (
    <View style={styles.card}>
      {item.foto ? (
        <Image
          accessibilityLabel={`Imagem de ${item.nome}`}
          source={{ uri: item.foto }}
          style={styles.foto}
        />
      ) : (
        <View style={[styles.foto, styles.fotoAusente]}>
          <Text style={styles.fotoAusenteTexto}>Imagem indisponível</Text>
        </View>
      )}
      <View style={styles.detalhes}>
        <Text style={styles.nome}>{item.nome || 'Herói sem nome'}</Text>
        <Text style={styles.forca}>Força: {item.forca ?? 'Não informada'}</Text>
        <Text style={styles.rotuloHabilidade}>Habilidades</Text>
        <Text style={styles.habilidade}>{item.habilidade || 'Não informadas'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.tela}>
      <View style={styles.cabecalho}>
        <Image
          accessibilityLabel="Estátua de anjo"
          source={require('../../../../assets/images/angel.png')}
          style={styles.anjo}
        />
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>𝔏𝔦𝔰𝔱𝔞 𝔡𝔢</Text>
          <Text style={styles.subtitulo}>ℌ𝔢𝔯ó𝔦𝔰</Text>
        </View>
        <Image
          accessibilityLabel="Peça de rei"
          source={require('../../../../assets/images/chess-king.png')}
          style={styles.rei}
        />
      </View>

      {carregando ? (
        <View style={styles.estado}>
          <ActivityIndicator size="large" color="#f0a500" />
          <Text style={styles.mensagem}>Carregando heróis...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estado}>
          <Text style={styles.erro}>Erro: {erro}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={tentaNovamente}
            style={styles.botao}
          >
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : herois.length === 0 ? (
        <View style={styles.estado}>
          <Text style={styles.mensagem}>Nenhum herói encontrado.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.lista}
          data={herois}
          keyExtractor={(item, index) => String(item.id ?? item.nome ?? index)}
          renderItem={renderizaHeroi}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#090f24',
    paddingTop: 44,
    paddingHorizontal: 12,
  },
  cabecalho: {
    alignItems: 'center',
    borderBottomColor: '#77809a',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
  },
  tituloContainer: {
    alignItems: 'center',
    flex: 1,
  },
  titulo: {
    alignSelf: 'center',
    color: '#f1eee4',
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 34,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitulo: {
    color: '#f1eee4',
    fontFamily: 'serif',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 5,
    lineHeight: 44,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  anjo: {
    height: 86,
    resizeMode: 'contain',
    width: 86,
  },
  rei: {
    height: 86,
    resizeMode: 'contain',
    width: 86,
  },
  lista: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ece9dc',
    borderColor: '#9aa0a8',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 210,
    overflow: 'hidden',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.55,
    shadowRadius: 7,
    elevation: 8,
  },
  foto: {
    width: '42%',
    height: '100%',
    minHeight: 210,
    backgroundColor: '#1a2544',
    borderRightColor: '#77809a',
    borderRightWidth: 2,
  },
  fotoAusente: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoAusenteTexto: {
    color: '#d8d5c8',
    fontFamily: 'serif',
    textAlign: 'center',
  },
  detalhes: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  nome: {
    borderBottomColor: '#33405d',
    borderBottomWidth: 1,
    color: '#1d2a50',
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    paddingBottom: 7,
    textAlign: 'center',
  },
  forca: {
    color: '#4b5578',
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  rotuloHabilidade: {
    color: '#263252',
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  habilidade: {
    color: '#30384e',
    fontFamily: 'serif',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#77809a',
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#ece9dc',
    marginBottom: 24,
    paddingBottom: 48,
    marginHorizontal: 8,
  },
  mensagem: {
    color: '#263252',
    fontFamily: 'serif',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  erro: {
    color: '#7f1d1d',
    fontFamily: 'serif',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  botao: {
    backgroundColor: '#263252',
    borderColor: '#111827',
    borderRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  textoBotao: {
    color: '#f1eee4',
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
  },
});
