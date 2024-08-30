'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { FaCheckCircle, FaRegCircle, FaEdit, FaPlay, FaPause, FaStop } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Details() {
  const [checklist, setChecklist] = useState<
    {
      item: string;
      checked: boolean;
      startDate: Date | null;
      endDate: Date | null;
    }[]
  >([
    { item: 'Item 1', checked: false, startDate: null, endDate: null },
    { item: 'Item 2', checked: false, startDate: null, endDate: null },
    { item: 'Item 3', checked: false, startDate: null, endDate: null },
  ]);

  const [objective, setObjective] = useState('Descrever o objetivo do que você está fuçando aqui.');
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroInterval, setPomodoroInterval] = useState<NodeJS.Timeout | null>(null);

  const pomodoroRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const toggleCheck = (index: number) => {
    const newChecklist = [...checklist];
    const currentItem = newChecklist[index];
    currentItem.checked = !currentItem.checked;
    currentItem.startDate = currentItem.startDate || new Date();
    currentItem.endDate = currentItem.checked ? new Date() : null;
    setChecklist(newChecklist);

    if (currentItem.checked) {
      const nextItemIndex = newChecklist.findIndex((item) => !item.checked && !item.startDate);
      if (nextItemIndex !== -1) {
        newChecklist[nextItemIndex].startDate = new Date();
        setChecklist(newChecklist);
      }
    }
  };

  const handleObjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObjective(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem(e.target.value);
  };

  const handleAddItem = () => {
    if (newItem.trim() === '') return;
    setChecklist([...checklist, { item: newItem, checked: false, startDate: null, endDate: null }]);
    setNewItem('');
  };

  const handleNewItemKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const handleItemEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingText(checklist[index].item);
  };

  const handleItemEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const handleItemEditBlur = () => {
    if (editingIndex !== null) {
      const newChecklist = [...checklist];
      newChecklist[editingIndex].item = editingText;
      setChecklist(newChecklist);
      setEditingIndex(null);
    }
  };

  const startPomodoro = () => {
    if (isPomodoroRunning) return;

    const nextItemIndex = checklist.findIndex((item) => !item.startDate);
    if (nextItemIndex !== -1) {
      const newChecklist = [...checklist];
      newChecklist[nextItemIndex].startDate = new Date();
      setChecklist(newChecklist);
    }

    setIsPomodoroRunning(true);
    setPomodoroInterval(
      setInterval(() => {
        setPomodoroTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(pomodoroInterval!);
            setIsPomodoroRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000),
    );
  };

  const pausePomodoro = () => {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
      setIsPomodoroRunning(false);
    }
  };

  const resetPomodoro = () => {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval);
    }
    setPomodoroTime(25 * 60);
    setIsPomodoroRunning(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pomodoroRef.current) {
      const rect = pomodoroRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && pomodoroRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const maxX = window.innerWidth - pomodoroRef.current.offsetWidth;
      const maxY = window.innerHeight - pomodoroRef.current.offsetHeight;

      pomodoroRef.current.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      pomodoroRef.current.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  const progress = (checklist.filter((item) => item.checked).length / checklist.length) * 100;

  const data = checklist.map((item) => ({
    name: item.item,
    Progresso: item.checked ? 100 : 0,
    'Tempo Gasto (min)': item.endDate && item.startDate ? (item.endDate.getTime() - item.startDate.getTime()) / 60000 : 0,
  }));

  return (
    <>
      <Head>
        <title>Fucei - Detalhes do card</title>
        <meta name="description" content="Detalhes do card." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex flex-col items-center justify-between min-h-screen bg-white text-black">
        <header className="w-full fixed top-0 bg-white p-4 shadow-md z-10">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl font-bold mb-4">Fucei - detalhes do card</h1>
          </div>
        </header>
        <div className="mt-32 w-full max-w-5xl p-4 overflow-y-auto flex-grow">
          <h2 className="text-2xl font-bold mb-4">Objetivo</h2>
          <div className="relative group mb-8">
            {isEditing ? (
              <textarea
                value={objective}
                onChange={handleObjectiveChange}
                onBlur={handleBlur}
                className="w-full p-2 border border-gray-300 rounded"
                autoFocus
              />
            ) : (
              <p className="mb-2">{objective}</p>
            )}
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="absolute top-0 right-0 p-1 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <FaEdit />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-4">Checklist</h2>
          <ul className="mb-8">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <button onClick={() => toggleCheck(index)} className="mr-2">
                    {item.checked ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                  </button>
                  {editingIndex === index ? (
                    <input
                      value={editingText}
                      onChange={handleItemEditChange}
                      onBlur={handleItemEditBlur}
                      className="border border-gray-300 p-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleItemEditClick(index)}>{item.item}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {item.startDate && (
                    <span>
                      Início: {item.startDate.toLocaleDateString()} {item.startDate.toLocaleTimeString()} <br />
                    </span>
                  )}
                  {item.endDate && (
                    <span>
                      Finalizado: {item.endDate.toLocaleDateString()} {item.endDate.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="flex mb-8">
            <input
              type="text"
              value={newItem}
              onChange={handleNewItemChange}
              onKeyPress={handleNewItemKeyPress}
              className="border border-gray-300 p-2 rounded-l flex-grow"
              placeholder="Adicionar novo item"
            />
            <button onClick={handleAddItem} className="bg-blue-600 text-white p-2 rounded-r hover:bg-blue-700 transition-colors">
              Adicionar
            </button>
          </div>
          <div
            ref={pomodoroRef}
            onMouseDown={handleMouseDown}
            className="fixed top-16 left-16 bg-gray-800 text-white p-4 rounded shadow-lg cursor-move"
            style={{ zIndex: 1000 }}>
            <div className="flex items-center mb-4">
              <div className="text-4xl font-bold mr-4">
                {Math.floor(pomodoroTime / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(pomodoroTime % 60).toString().padStart(2, '0')}
              </div>
              <button onClick={startPomodoro} className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
                <FaPlay />
              </button>
              <button onClick={pausePomodoro} className="mr-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                <FaPause />
              </button>
              <button onClick={resetPomodoro} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                <FaStop />
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Barra de Progresso</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
            <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Gráficos de Progresso e Tempo Gasto</h2>
          <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Progresso" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-2xl font-bold mb-4">Distribuição do Tempo Gasto</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Tempo Gasto (min)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </>
  );
}