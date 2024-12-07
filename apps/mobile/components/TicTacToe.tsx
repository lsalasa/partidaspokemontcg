/**
 * Universidad Cenfotec
 * Proyecto de Ingeniería 4
 * Práctica 2: Tic Tac Toe (Juego del Gato)
 * Desarrollado por: Luis Diego Salas Arce
 * 2024
 * Componente principal del juego Tic Tac Toe (Gato)
 * Implementa toda la lógica del juego y la interfaz de usuario
 * con un diseño responsivo optimizado para modo Portrait
 */
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';

/**
 * Obtiene las dimensiones de la pantalla para cálculos responsivos
 */
const { width, height } = Dimensions.get('window');
const boxSize = Math.min(width * 0.25, height * 0.12); // Tamaño responsivo para las casillas

const TicTacToe = () => {
    // Estados del juego
    const [board, setBoard] = useState(Array(9).fill(''));
    const [isXTurn, setIsXTurn] = useState(true);
    const [gameOver, setGameOver] = useState(false);

    /**
     * Verifica si hay un ganador en el tablero actual
     * @param {Array} squares - Estado actual del tablero
     * @returns {string|null} - Retorna 'X' o 'O' si hay ganador, null si no hay
     */
    const checkWinner = (squares: any[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontales
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticales
            [0, 4, 8], [2, 4, 6] // diagonales
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
            }
        }
        return null;
    };

  /**
   * Maneja el evento de presionar una casilla
   * @param {number} index - Índice de la casilla presionada
   */
    const handlePress = (index: number) => {
        if (board[index] || gameOver) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = isXTurn ? 'X' : 'O';
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setGameOver(true);
            Alert.alert('¡Fin del juego!', `¡Jugador ${winner} ha ganado!`);
            return;
        }

        if (!newBoard.includes('')) {
            setGameOver(true);
            Alert.alert('¡Fin del juego!', '¡Empate!');
            return;
        }

        setIsXTurn(!isXTurn);
        };

    /**
     * Reinicia el juego a su estado inicial
     */
    const resetGame = () => {
        setBoard(Array(9).fill(''));
        setIsXTurn(true);
        setGameOver(false);
    };

  /**
   * Renderiza una casilla individual del tablero
   * @param {number} index - Índice de la casilla a renderizar
   */
    const renderSquare = (index: number) => {
        return (
            <TouchableOpacity
            style={[
                styles.square,
                board[index] && styles.squareOccupied
            ]}
            onPress={() => handlePress(index)}
            >
            <Text style={[
                styles.squareText,
                board[index] === 'X' ? styles.xText : styles.oText
            ]}>
                {board[index]}
            </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundPattern} />
            
            <View style={styles.gameContainer}>
            <Text style={styles.title}>Juego del Gato</Text>
            <Text style={styles.status}>
                Turno del jugador: <Text style={isXTurn ? styles.xText : styles.oText}>{isXTurn ? 'X' : 'O'}</Text>
            </Text>
            
            <View style={styles.board}>
                <View style={styles.row}>
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
                </View>
                <View style={styles.row}>
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
                </View>
                <View style={styles.row}>
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
                </View>
            </View>

            <TouchableOpacity 
                style={styles.resetButton} 
                onPress={resetGame}
            >
                <Text style={styles.resetButtonText}>Reiniciar Juego</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      height: '100%',
      backgroundColor: '#1a1a2e',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#ffffff',
      borderRadius: 1,
    },
    gameContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: height * 0.05,
    },
    headerContainer: {
      alignItems: 'center',
      paddingTop: height * 0.02,
    },
    title: {
      fontSize: Math.min(width * 0.08, 40),
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: height * 0.02,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: -1, height: 1 },
      textShadowRadius: 10,
    },
    status: {
      fontSize: Math.min(width * 0.06, 30),
      color: '#fff',
      fontWeight: '600',
      marginBottom: height * 0.02,
    },
    board: {
      padding: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    row: {
      flexDirection: 'row',
    },
    square: {
      width: boxSize,
      height: boxSize,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 10,
      margin: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    squareOccupied: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    squareText: {
      fontSize: boxSize * 0.6,
      fontWeight: 'bold',
    },
    xText: {
      color: '#4CAF50',
    },
    oText: {
      color: '#e94560',
    },
    resetButton: {
      marginTop: height * 0.05,
      backgroundColor: '#4CAF50',
      paddingHorizontal: width * 0.08,
      paddingVertical: height * 0.02,
      borderRadius: 25,
      minWidth: width * 0.5,
      maxWidth: 300,
      alignItems: 'center',
      shadowColor: '#4CAF50',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 5,
    },
    resetButtonText: {
      color: '#ffffff',
      fontSize: Math.min(width * 0.045, 20),
      fontWeight: 'bold',
    },
});

export default TicTacToe;