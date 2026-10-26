import React, { useState, useRef } from 'react';
import {
  UserProfile,
  DayHabitLog,
  Recipe,
  NutritionPlanNote,
  AthleteData,
  CustomMealEntry,
} from '../../types';
import { SportIcon } from '../SportIcons';
import { NutriOtter } from '../NutriOtter';
import { MoodEmoji } from '../MoodEmojis';
import { PhotoViewerModal } from '../PhotoViewerModal';
import { RecipeModal } from '../RecipeModal';
import { compressImageFile } from '../../utils/imageCompressor';

// Quick suggestions for meal times, while allowing the nutritionist to freely write any meal time
export const MEAL_TIME_SUGGESTIONS = [
  'Desayuno',
  'Merienda AM',
  'Almuerzo',
  'Pre-entreno',
  'Post-entreno',
  'Merienda PM',
  'Cena',
  'Snack proteico',
];

// Preset healthy sports plate images for instant selection
export const HEALTHY_PLATE_PRESETS = [
  {
    name: 'Bowl de Avena con Frutas',
    url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
    category: 'Desayunos' as const,
  },
  {
    name: 'Tostada con Aguacate y Huevo',
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    category: 'Desayunos' as const,
  },
  {
    name: 'Pechuga a la Plancha con Quinoa',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    category: 'Almuerzos' as const,
  },
  {
    name: 'Salmón con Espárragos',
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
    category: 'Almuerzos' as const,
  },
  {
    name: 'Batido Proteico de Frutos Rojos',
    url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
    category: 'Meriendas' as const,
  },
  {
    name: 'Yogur Griego con Nueces',
    url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    category: 'Meriendas' as const,
  },
  {
    name: 'Bowl de Atún y Garbanzos',
    url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    category: 'Almuerzos' as const,
  },
  {
    name: 'Pancakes de Avena y Plátano',
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    category: 'Desayunos' as const,
  },
];

interface NutritionistScreenProps {
  nutritionistName: string;
  onUpdateNutritionistName: (name: string) => void;
  athletes: AthleteData[];
  selectedAthleteId: string;
  onSelectAthlete: (id: string) => void;
  athleteProfile: UserProfile | AthleteData;
  todayLog: DayHabitLog;
  logsHistory: Record<string, DayHabitLog>;
  nutritionPlan: NutritionPlanNote;
  onUpdateNutritionPlan: (plan: NutritionPlanNote) => void;
  recipes?: Recipe[];
  onAddRecipe: (recipe: Recipe) => void;
  onDeleteRecipe?: (id: string) => void;
  onUpdateRecipe?: (recipe: Recipe) => void;
  onViewAthleteHome: () => void;
}

export const NutritionistScreen: React.FC<NutritionistScreenProps> = ({
  nutritionistName,
  onUpdateNutritionistName,
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  athleteProfile,
  todayLog,
  logsHistory,
  nutritionPlan,
  onUpdateNutritionPlan,
  recipes = [],
  onAddRecipe,
  onDeleteRecipe,
  onUpdateRecipe,
  onViewAthleteHome,
}) => {
  const [activeTab, setActiveTab] = useState<'progreso' | 'editar_nutricion' | 'recetas'>('progreso');
  const [isEditingNutriName, setIsEditingNutriName] = useState(false);
  const [tempNutriName, setTempNutriName] = useState(nutritionistName);
  const [viewingMealPhoto, setViewingMealPhoto] = useState<CustomMealEntry | null>(null);

  // Form states for nutrition editing
  const [targetCalories, setTargetCalories] = useState(nutritionPlan.targetCalories);
  const [targetProtein, setTargetProtein] = useState(nutritionPlan.targetProtein);
  const [targetWater, setTargetWater] = useState(nutritionPlan.targetWaterGlasses);
  const [activeTip, setActiveTip] = useState(nutritionPlan.activeNutriTip);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>(nutritionPlan.recommendations);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Recipe Form states
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeCategory, setRecipeCategory] = useState<string>('Merienda AM');
  const [recipeCalories, setRecipeCalories] = useState(320);
  const [recipeProtein, setRecipeProtein] = useState('22g');
  const [recipeCarbs, setRecipeCarbs] = useState('35g');
  const [recipeFats, setRecipeFats] = useState('10g');
  const [recipeIngredients, setRecipeIngredients] = useState('Yogur griego, Frutas del bosque, Semillas de chía');
  const [recipeBenefit, setRecipeBenefit] = useState('Excelente recarga de glucógeno y síntesis proteica.');
  const [plateImage, setPlateImage] = useState<string>(HEALTHY_PLATE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [recipeAlert, setRecipeAlert] = useState<string | null>(null);

  // Recipes filter & view states
  const [recipeFilter, setRecipeFilter] = useState<string>('Todas');
  const [activeRecipeModal, setActiveRecipeModal] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // State for changing photo of existing recipe
  const [editingPhotoRecipe, setEditingPhotoRecipe] = useState<Recipe | null>(null);

  // State for editing all fields of an existing recipe (Edit Recipe Modal)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrepTime, setEditPrepTime] = useState('15 min');
  const [editCalories, setEditCalories] = useState(300);
  const [editProtein, setEditProtein] = useState('20g');
  const [editCarbs, setEditCarbs] = useState('30g');
  const [editFats, setEditFats] = useState('10g');
  const [editIngredients, setEditIngredients] = useState('');
  const [editBenefit, setEditBenefit] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCustomUrl, setEditCustomUrl] = useState('');
  const [showEditUrlInput, setShowEditUrlInput] = useState(false);
  const [isProcessingEditPhoto, setIsProcessingEditPhoto] = useState(false);

  // Hidden file input refs for camera and gallery
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const editRecipeCameraRef = useRef<HTMLInputElement>(null);
  const editRecipeGalleryRef = useRef<HTMLInputElement>(null);
  const editModalCameraRef = useRef<HTMLInputElement>(null);
  const editModalGalleryRef = useRef<HTMLInputElement>(null);

  const handleSaveNutritionPlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: NutritionPlanNote = {
      ...nutritionPlan,
      targetCalories: Number(targetCalories),
      targetProtein: Number(targetProtein),
      targetWaterGlasses: Number(targetWater),
      activeNutriTip: activeTip.trim(),
      recommendations,
      date: new Date().toISOString().split('T')[0],
    };
    onUpdateNutritionPlan(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddRecommendation = () => {
    if (!newRecommendation.trim()) return;
    setRecommendations([...recommendations, newRecommendation.trim()]);
    setNewRecommendation('');
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_: string, i: number) => i !== index));
  };

  // Handle camera photo or gallery upload for new recipe
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImageFile(file, 800, 800, 0.75);
      setPlateImage(compressed);
      setRecipeAlert('✓ Foto del plato cargada con éxito.');
      setTimeout(() => setRecipeAlert(null), 3000);
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar la foto. Intenta con otra imagen.');
    } finally {
      setIsProcessingPhoto(false);
      e.target.value = '';
    }
  };

  // Handle photo update for an existing recipe
  const handleExistingRecipePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhotoRecipe || !onUpdateRecipe) return;

    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImageFile(file, 800, 800, 0.75);
      const updated: Recipe = { ...editingPhotoRecipe, image: compressed };
      onUpdateRecipe(updated);
      setEditingPhotoRecipe(null);
      setRecipeAlert('✓ Foto del plato actualizada con éxito.');
      setTimeout(() => setRecipeAlert(null), 3000);
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar la foto.');
    } finally {
      setIsProcessingPhoto(false);
      e.target.value = '';
    }
  };

  const handleApplyPresetToExistingRecipe = (url: string) => {
    if (!editingPhotoRecipe || !onUpdateRecipe) return;
    const updated: Recipe = { ...editingPhotoRecipe, image: url };
    onUpdateRecipe(updated);
    setEditingPhotoRecipe(null);
    setRecipeAlert('✓ Foto del plato actualizada.');
    setTimeout(() => setRecipeAlert(null), 3000);
  };

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeTitle.trim()) return;

    const newRecipe: Recipe = {
      id: `recipe-custom-${Date.now()}`,
      category: recipeCategory,
      title: recipeTitle.trim(),
      prepTime: '15 min',
      calories: Number(recipeCalories),
      protein: recipeProtein,
      carbs: recipeCarbs,
      fats: recipeFats,
      image: plateImage || HEALTHY_PLATE_PRESETS[0].url,
      description: `Receta deportiva prescrita por Lic: ${nutritionistName || 'Nutricionista'}`,
      ingredients: recipeIngredients
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
      steps: [
        'Organizar y lavar los ingredientes frescos.',
        'Mezclar o cocinar según las porciones recomendadas.',
        'Consumir en el horario planificado según la sesión de entrenamiento.',
      ],
      athleteBenefit: recipeBenefit.trim() || 'Aporte óptimo para energía y recuperación muscular.',
    };

    onAddRecipe(newRecipe);
    setRecipeTitle('');
    setShowRecipeForm(false);
    setRecipeAlert(`✓ Receta "${newRecipe.title}" publicada en el catálogo.`);
    setTimeout(() => setRecipeAlert(null), 4000);
  };

  const handleDeleteRecipe = (id: string) => {
    if (onDeleteRecipe) {
      onDeleteRecipe(id);
      setRecipeToDelete(null);
      setRecipeAlert('✓ Receta eliminada del catálogo.');
      setTimeout(() => setRecipeAlert(null), 3000);
    }
  };

  // Open edit modal prefilled with existing recipe data
  const handleStartEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setEditTitle(recipe.title);
    setEditCategory(recipe.category || 'Merienda AM');
    setEditPrepTime(recipe.prepTime || '15 min');
    setEditCalories(recipe.calories || 300);
    setEditProtein(recipe.protein || '20g');
    setEditCarbs(recipe.carbs || '30g');
    setEditFats(recipe.fats || '10g');
    setEditIngredients(recipe.ingredients ? recipe.ingredients.join(', ') : '');
    setEditBenefit(recipe.athleteBenefit || '');
    setEditImage(recipe.image || HEALTHY_PLATE_PRESETS[0].url);
    setEditCustomUrl('');
    setShowEditUrlInput(false);
  };

  // Save changes to the edited recipe
  const handleSaveEditRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecipe || !onUpdateRecipe) return;
    if (!editTitle.trim()) {
      alert('Por favor ingresa un nombre para la receta.');
      return;
    }

    const updatedRecipe: Recipe = {
      ...editingRecipe,
      title: editTitle.trim(),
      category: editCategory.trim() || 'General',
      prepTime: editPrepTime.trim() || '15 min',
      calories: Number(editCalories) || 0,
      protein: editProtein.trim() || '0g',
      carbs: editCarbs.trim() || '0g',
      fats: editFats.trim() || '0g',
      image: editImage || editingRecipe.image,
      ingredients: editIngredients
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean),
      athleteBenefit: editBenefit.trim() || 'Aporte óptimo para energía y recuperación muscular.',
    };

    onUpdateRecipe(updatedRecipe);
    setEditingRecipe(null);
    setRecipeAlert(`✓ Receta "${updatedRecipe.title}" actualizada con éxito.`);
    setTimeout(() => setRecipeAlert(null), 4000);
  };

  // Upload or capture new photo for the recipe being edited in modal
  const handleEditModalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingEditPhoto(true);
      const compressed = await compressImageFile(file, 800, 800, 0.75);
      setEditImage(compressed);
    } catch (err) {
      console.error(err);
      alert('No se pudo procesar la foto.');
    } finally {
      setIsProcessingEditPhoto(false);
      e.target.value = '';
    }
  };

  // Calculate adherence
  const customMealsList = todayLog.customMeals || [];
  const completedMealsCount =
    customMealsList.length > 0
      ? customMealsList.length
      : Object.values(todayLog.meals).filter(Boolean).length;
  const adherencePercent = Math.min(100, Math.round((completedMealsCount / 5) * 100));

  // Dynamic filter categories from available recipes
  const availableFilterCategories = Array.from(
    new Set(['Todas', ...recipes.map((r) => r.category).filter(Boolean)])
  );

  const filteredRecipes = recipes.filter((r) => {
    if (recipeFilter === 'Todas') return true;
    return r.category.toLowerCase() === recipeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col justify-between min-h-[660px] p-3.5 select-none space-y-3 animate-fadeIn overflow-y-auto max-h-[85vh]">
      {/* Hidden File Inputs for Plate Photos */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Hidden File Inputs for Editing Existing Recipe Photo */}
      <input
        ref={editRecipeCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleExistingRecipePhotoUpload}
      />
      <input
        ref={editRecipeGalleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleExistingRecipePhotoUpload}
      />

      {/* Hidden File Inputs for Edit Recipe Modal Photo */}
      <input
        ref={editModalCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleEditModalPhotoUpload}
      />
      <input
        ref={editModalGalleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleEditModalPhotoUpload}
      />

      {/* Top Banner: Panel del Nutricionista with Lic: Prefix */}
      <div className="bg-[#a7f3d0] border-2 border-[#6ee7b7] px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-2xs">
            🥗
          </div>
          <div>
            <h2 className="text-emerald-950 font-black text-sm md:text-base leading-tight">
              Panel del Nutricionista
            </h2>
            {isEditingNutriName ? (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-bold text-emerald-900">Lic:</span>
                <input
                  type="text"
                  value={tempNutriName}
                  onChange={(e) => setTempNutriName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="bg-white text-xs font-bold text-gray-900 px-1.5 py-0.5 rounded border border-emerald-400 w-28"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    onUpdateNutritionistName(tempNutriName.trim());
                    setIsEditingNutriName(false);
                  }}
                  className="text-[10px] font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] text-emerald-800 font-bold">
                  Lic: {nutritionistName || 'Nutricionista'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTempNutriName(nutritionistName);
                    setIsEditingNutriName(true);
                  }}
                  className="text-[9px] text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                >
                  (cambiar nombre)
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAthleteHome}
          className="text-[11px] font-extrabold text-emerald-950 bg-white hover:bg-emerald-50 px-2.5 py-1 rounded-xl shadow-2xs border border-emerald-300 transition-all cursor-pointer"
          title="Ver cómo ve la aplicación el deportista"
        >
          Vista Deportista →
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-[#cbd5e1]/70 p-1 rounded-2xl border border-white/60">
        <button
          type="button"
          onClick={() => setActiveTab('progreso')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'progreso'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Progreso Deportista
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editar_nutricion')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'editar_nutricion'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Plan Nutricional
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recetas')}
          className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
            activeTab === 'recetas'
              ? 'bg-white text-gray-950 shadow-sm'
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          Recetas ({recipes.length})
        </button>
      </div>

      {/* Global Alert Notification */}
      {recipeAlert && (
        <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 px-3 py-2 rounded-xl text-xs font-bold text-center shadow-xs animate-fadeIn">
          {recipeAlert}
        </div>
      )}

      {/* TAB 1: Progreso del Deportista Activo */}
      {activeTab === 'progreso' && (
        <div className="space-y-3">
          {/* Athlete Selector Strip */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-2.5 rounded-2xl shadow-xs">
            <span className="text-[10px] font-black text-gray-700 block mb-1 uppercase tracking-wider">
              Seleccionar Deportista a Evaluar ({athletes.length}):
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {athletes.map((ath) => {
                const isSelected = ath.id === selectedAthleteId;
                return (
                  <button
                    key={ath.id}
                    type="button"
                    onClick={() => onSelectAthlete(ath.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <SportIcon sport={ath.sport} size={16} />
                    <span>{ath.name || 'Sin nombre'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Athlete Profile Card */}
          <div className="bg-[#fdfbf7] border-2 border-emerald-400 rounded-2xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <SportIcon sport={athleteProfile.sport} size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 leading-tight">
                    {athleteProfile.name ? athleteProfile.name : 'Deportista Activo'}
                  </h3>
                  <span className="text-[10px] text-gray-600 font-semibold">
                    {athleteProfile.sport.toUpperCase()} • {athleteProfile.ageGroup} • {athleteProfile.gender}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Adherencia: {adherencePercent}%
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span className="text-[9px] font-bold text-amber-900 block">Comidas Hoy</span>
                <span className="text-base font-black text-amber-950">{completedMealsCount} / 5</span>
              </div>
              <div className="bg-sky-50 p-2 rounded-xl border border-sky-200">
                <span className="text-[9px] font-bold text-sky-900 block">Hidratación</span>
                <span className="text-base font-black text-sky-950">
                  {todayLog.waterGlasses * 250} ml
                </span>
                <span className="text-[9px] font-bold text-sky-800 block">
                  ({todayLog.waterGlasses}/8 vasos)
                </span>
              </div>
              <div className="bg-purple-50 p-2 rounded-xl border border-purple-200">
                <span className="text-[9px] font-bold text-purple-900 block">Estado Ánimo</span>
                <span className="text-base font-black text-purple-950 capitalize">
                  {todayLog.mood || 'Feliz'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Custom Meals Registered with Photos */}
          <div className="bg-[#cbd5e1]/70 p-3 rounded-2xl border border-white/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-900">
                Fotos y Tiempos de Comida Registrados ({customMealsList.length})
              </span>
              <span className="text-[10px] font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded-md">
                Fecha: {todayLog.date}
              </span>
            </div>

            {customMealsList.length > 0 ? (
              <div className="space-y-2">
                {customMealsList.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white rounded-xl p-2.5 border border-gray-200 shadow-2xs flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {meal.photoUrl ? (
                        <div
                          onClick={() => setViewingMealPhoto(meal)}
                          className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-300 shadow-2xs cursor-pointer hover:scale-105 transition-transform relative group"
                          title="Toca para ampliar foto del plato"
                        >
                          <img
                            src={meal.photoUrl}
                            alt={meal.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                            🔍
                          </div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-amber-50 border border-dashed border-amber-300 flex flex-col items-center justify-center text-amber-700 shrink-0 text-center">
                          <span className="text-sm">📷</span>
                          <span className="text-[8px] font-bold leading-tight">Sin foto</span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-black text-gray-900 truncate">
                            {meal.title}
                          </span>
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded shrink-0">
                            {meal.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-700 line-clamp-2 leading-relaxed">
                          {meal.description || 'Sin descripción detallada por el deportista.'}
                        </p>
                      </div>
                    </div>

                    {meal.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setViewingMealPhoto(meal)}
                        className="text-[10px] font-black bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-1 rounded-lg shrink-0 cursor-pointer shadow-2xs"
                      >
                        Ver foto
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 p-3 rounded-xl text-center text-gray-600 text-[11px] font-medium border border-dashed border-gray-300">
                El deportista aún no ha subido fotos ni registrado tiempos de comida hoy.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Editar Plan Nutricional */}
      {activeTab === 'editar_nutricion' && (
        <form onSubmit={handleSaveNutritionPlan} className="space-y-3">
          {savedSuccess && (
            <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 px-3 py-2 rounded-xl text-xs font-bold text-center animate-fadeIn">
              ✓ Plan Nutricional guardado y sincronizado con el deportista
            </div>
          )}

          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-3 rounded-2xl shadow-xs space-y-2.5">
            <span className="text-xs font-black text-gray-900 block">
              Metas Diarias Prescritas
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Calorías (kcal)</label>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Proteína (g)</label>
                <input
                  type="number"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(Number(e.target.value))}
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Vasos de Agua</label>
                <input
                  type="number"
                  value={targetWater}
                  onChange={(e) => setTargetWater(Number(e.target.value))}
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                Nutri-Dato Activo (se muestra en el Dashboard del Deportista)
              </label>
              <textarea
                value={activeTip}
                onChange={(e) => setActiveTip(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Recommendations List */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-3 rounded-2xl shadow-xs space-y-2">
            <span className="text-xs font-black text-gray-900 block">
              Pautas y Recomendaciones del Nutricionista
            </span>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {recommendations.map((rec: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200 text-xs"
                >
                  <span className="text-gray-800 pr-2 leading-tight">{rec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecommendation(i)}
                    className="text-rose-600 font-bold px-1.5 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Eliminar recomendación"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add new recommendation */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
                placeholder="Nueva pauta (ej. electrolitos en días calurosos)..."
                className="flex-1 p-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddRecommendation}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Guardar y Actualizar Información Nutricional
          </button>
        </form>
      )}

      {/* TAB 3: Gestión de Recetas del Catálogo & Prescripción */}
      {activeTab === 'recetas' && (
        <div className="space-y-3">
          {/* Header Action Bar: Prescribe Toggle & Count */}
          <div className="bg-[#f5eedc] border border-[#e4dcbf] p-3 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-gray-900 block">
                Catálogo de Recetas Saludables
              </span>
              <span className="text-[10px] text-gray-600 font-bold">
                {recipes.length} platillos registrados para los deportistas
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowRecipeForm((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
                showRecipeForm
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>{showRecipeForm ? '✕ Cancelar' : '📸 + Nueva Receta'}</span>
            </button>
          </div>

          {/* FORM: Prescribe New Recipe with Plate Images */}
          {showRecipeForm && (
            <form onSubmit={handleCreateRecipe} className="bg-[#fdfbf7] border-2 border-emerald-400 rounded-2xl p-3 shadow-md space-y-3 animate-fadeIn">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-xs font-black text-emerald-950 block">
                  Prescribir Nuevo Platillo con Foto
                </span>
                <p className="text-[10px] text-gray-600">
                  Toma una foto real del plato, sube una imagen o elige de los platillos saludables recomendados.
                </p>
              </div>

              {/* Title & Written Meal Time */}
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Nombre del platillo *
                  </label>
                  <input
                    type="text"
                    value={recipeTitle}
                    onChange={(e) => setRecipeTitle(e.target.value)}
                    placeholder="Ej. Bowl de Avena con Frutas y Nueces"
                    required
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                    Tiempo de comida correspondiente (escribe el que corresponda) *
                  </label>
                  <input
                    type="text"
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value)}
                    placeholder="Ej. Pre-entreno, Desayuno, Almuerzo, Cena, Merienda AM..."
                    required
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-emerald-400"
                  />
                  {/* Quick Select Suggestion Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                    <span className="text-[9px] font-bold text-gray-500">Sugerencias rápidas:</span>
                    {MEAL_TIME_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setRecipeCategory(sug)}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                          recipeCategory.toLowerCase() === sug.toLowerCase()
                            ? 'bg-emerald-600 text-white shadow-2xs font-black'
                            : 'bg-white hover:bg-emerald-50 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECCIÓN IMAGEN DEL PLATO */}
              <div className="bg-[#f5eedc] border border-amber-300 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    <span>📸</span> Imagen del Platillo
                  </span>
                  {isProcessingPhoto && (
                    <span className="text-[10px] font-bold text-emerald-800 animate-pulse">
                      Comprimiendo imagen...
                    </span>
                  )}
                </div>

                {/* Plate Image Preview */}
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-sm shrink-0 bg-gray-100">
                    <img
                      src={plateImage}
                      alt="Vista previa del plato"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-black text-emerald-900 block truncate">
                      Foto seleccionada para este plato
                    </span>
                    <p className="text-[9px] text-gray-600 mb-2">
                      Esta imagen aparecerá en el catálogo "Recetas saludables" del atleta.
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>📷</span> Tomar foto
                      </button>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>🖼️</span> Galería
                      </button>
                    </div>
                  </div>
                </div>

                {/* Healthy Plate Presets Carousel */}
                <div>
                  <span className="text-[10px] font-bold text-gray-700 block mb-1">
                    O elige una foto recomendada de platillos saludables:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {HEALTHY_PLATE_PRESETS.map((preset, idx) => {
                      const isSelected = plateImage === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPlateImage(preset.url);
                            setRecipeCategory(preset.category);
                          }}
                          className={`flex flex-col items-center p-1 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-100 border-2 border-emerald-500 ring-2 ring-emerald-300 scale-102 shadow-xs'
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                          title={preset.name}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden mb-1">
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[8px] font-black text-gray-800 text-center leading-tight line-clamp-1">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input Toggle */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[9px] font-bold text-emerald-800 underline cursor-pointer"
                  >
                    {showUrlInput ? 'Ocultar enlace web' : '+ O ingresar URL externa de imagen'}
                  </button>
                  {showUrlInput && (
                    <div className="flex gap-1.5 mt-1">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-1.5 text-xs rounded-xl border border-gray-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customImageUrl.trim()) {
                            setPlateImage(customImageUrl.trim());
                            setCustomImageUrl('');
                          }
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Nutritional Macros */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Calorías</label>
                  <input
                    type="number"
                    value={recipeCalories}
                    onChange={(e) => setRecipeCalories(Number(e.target.value))}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Proteína</label>
                  <input
                    type="text"
                    value={recipeProtein}
                    onChange={(e) => setRecipeProtein(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Carbos</label>
                  <input
                    type="text"
                    value={recipeCarbs}
                    onChange={(e) => setRecipeCarbs(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-700 block mb-0.5">Grasas</label>
                  <input
                    type="text"
                    value={recipeFats}
                    onChange={(e) => setRecipeFats(e.target.value)}
                    className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
              </div>

              {/* Ingredients & Athlete Benefit */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Ingredientes (separados por coma)
                </label>
                <input
                  type="text"
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Beneficio para el Rendimiento Deportivo
                </label>
                <input
                  type="text"
                  value={recipeBenefit}
                  onChange={(e) => setRecipeBenefit(e.target.value)}
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRecipeForm(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✓</span> Publicar Receta con Foto
                </button>
              </div>
            </form>
          )}

          {/* Filter Categories for Existing Recipes */}
          <div className="flex gap-1.5 bg-[#cbd5e1]/50 p-1 rounded-xl overflow-x-auto">
            {availableFilterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setRecipeFilter(cat)}
                className={`shrink-0 py-1 px-2.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                  recipeFilter.toLowerCase() === cat.toLowerCase()
                    ? 'bg-white text-gray-950 shadow-2xs font-extrabold'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Confirm Delete Prompt Banner */}
          {recipeToDelete && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 shadow-md text-center space-y-2 animate-fadeIn">
              <span className="text-xs font-black text-rose-950 block">
                ¿Eliminar "{recipeToDelete.title}" del catálogo?
              </span>
              <p className="text-[10px] text-rose-800">
                Esta receta ya no estará disponible para los deportistas en la sección de Recetas.
              </p>
              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDeleteRecipe(recipeToDelete.id)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs"
                >
                  Sí, eliminar receta
                </button>
                <button
                  type="button"
                  onClick={() => setRecipeToDelete(null)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Recipes List */}
          {filteredRecipes.length > 0 ? (
            <div className="space-y-2.5">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-2xl p-3 border-2 border-amber-200 shadow-2xs space-y-2 relative group hover:border-amber-400 transition-all"
                >
                  <div className="flex gap-3 items-start">
                    {/* Plate Image with Zoom & Change overlay */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-amber-300 shadow-inner group/img bg-amber-50">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveRecipeModal(recipe)}
                        className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black cursor-pointer"
                        title="Ver foto del plato en grande"
                      >
                        🔍 Ver
                      </button>
                    </div>

                    {/* Recipe Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                          {recipe.category}
                        </span>
                        <span className="text-[10px] font-black text-gray-900">
                          {recipe.calories} kcal
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-gray-950 leading-tight mb-1 truncate">
                        {recipe.title}
                      </h4>

                      {/* Macros Chips */}
                      <div className="flex gap-1.5 text-[9px] font-bold mb-1.5">
                        <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          P: {recipe.protein}
                        </span>
                        <span className="text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          C: {recipe.carbs}
                        </span>
                        <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          G: {recipe.fats}
                        </span>
                      </div>

                      <p className="text-[10px] text-gray-600 line-clamp-1">
                        {recipe.athleteBenefit || recipe.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons for Nutritionist: Change Photo, Edit Recipe, View Recipe, Delete */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingPhotoRecipe(recipe)}
                      className="text-[10px] font-black text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Cambiar la imagen del plato de esta receta"
                    >
                      <span>📷</span> Cambiar foto
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* EDIT RECIPE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleStartEditRecipe(recipe)}
                        className="text-[10px] font-black text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        title="Editar receta publicada (tiempo de comida, foto, ingredientes, calorías)"
                      >
                        <span>✏️</span> Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveRecipeModal(recipe)}
                        className="text-[10px] font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Ver detalle
                      </button>

                      {/* DELETE RECIPE BUTTON */}
                      <button
                        type="button"
                        onClick={() => setRecipeToDelete(recipe)}
                        className="text-[10px] font-black text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                        title="Eliminar receta del catálogo"
                      >
                        <span>🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white/90 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center space-y-2">
              <span className="text-3xl">🥗📸</span>
              <h4 className="text-xs font-black text-gray-900">
                {recipeFilter === 'Todas'
                  ? 'Aún no hay recetas prescritas'
                  : `No hay recetas en ${recipeFilter}`}
              </h4>
              <p className="text-[10px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Prescribe platillos saludables con fotos de platos reales para que tus atletas tengan las mejores opciones nutricionales.
              </p>
              <button
                type="button"
                onClick={() => setShowRecipeForm(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition-all"
              >
                + Prescribir primera receta
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal for Changing Photo of an Existing Recipe */}
      {editingPhotoRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fdfbf7] rounded-3xl max-w-sm w-full p-4 shadow-2xl border-4 border-emerald-400 text-gray-900 space-y-3 relative">
            <button
              type="button"
              onClick={() => setEditingPhotoRecipe(null)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors cursor-pointer text-sm"
            >
              ✕
            </button>

            <div className="pr-6">
              <h3 className="text-xs font-black text-gray-950">
                Cambiar foto del platillo
              </h3>
              <p className="text-[10px] text-gray-600 truncate">
                Receta: "{editingPhotoRecipe.title}"
              </p>
            </div>

            {/* Current Photo */}
            <div className="w-full h-36 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-inner bg-amber-50">
              <img
                src={editingPhotoRecipe.image}
                alt={editingPhotoRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Upload Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => editRecipeCameraRef.current?.click()}
                className="py-2 px-3 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📷</span> Tomar foto
              </button>
              <button
                type="button"
                onClick={() => editRecipeGalleryRef.current?.click()}
                className="py-2 px-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🖼️</span> Galería
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <span className="text-[10px] font-bold text-gray-700 block mb-1">
                O selecciona de fotos de platillos:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {HEALTHY_PLATE_PRESETS.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPresetToExistingRecipe(p.url)}
                    className="w-full h-12 rounded-lg overflow-hidden border border-gray-300 hover:border-emerald-500 hover:scale-105 transition-all cursor-pointer shadow-2xs"
                    title={p.name}
                  >
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditingPhotoRecipe(null)}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal for Editing Published Recipe */}
      {editingRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-[#fdfbf7] rounded-3xl max-w-md w-full p-4 md:p-5 shadow-2xl border-4 border-amber-400 text-gray-900 space-y-3 relative my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-2 border-b border-amber-200">
              <div>
                <h3 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
                  <span>✏️</span> Editar Receta Publicada
                </h3>
                <p className="text-[10px] text-gray-600">
                  Modifica el tiempo de comida, foto del plato, macros e ingredientes.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRecipe(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEditRecipe} className="overflow-y-auto pr-1 space-y-3 flex-1 text-xs">
              {/* Recipe Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Nombre del platillo *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              {/* Meal Time (Tiempo de comida) */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Tiempo de comida correspondiente (escribe el que corresponda) *
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Ej. Pre-entreno, Almuerzo, Cena, Merienda AM..."
                  className="w-full p-2 text-xs font-bold rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-amber-400"
                  required
                />
                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                  <span className="text-[9px] font-bold text-gray-500">Sugerencias rápidas:</span>
                  {MEAL_TIME_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setEditCategory(sug)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                        editCategory.toLowerCase() === sug.toLowerCase()
                          ? 'bg-amber-600 text-white shadow-2xs font-black'
                          : 'bg-white hover:bg-amber-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo section */}
              <div className="bg-[#f5eedc] border border-amber-300 rounded-2xl p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-gray-900 flex items-center gap-1">
                    <span>📸</span> Foto del Platillo
                  </span>
                  {isProcessingEditPhoto && (
                    <span className="text-[9px] font-bold text-emerald-800 animate-pulse">
                      Comprimiendo imagen...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-400 shrink-0 bg-gray-100 shadow-inner">
                    <img
                      src={editImage}
                      alt="Foto del plato"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-800 block mb-1">
                      Cambiar foto con:
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => editModalCameraRef.current?.click()}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>📷</span> Cámara
                      </button>
                      <button
                        type="button"
                        onClick={() => editModalGalleryRef.current?.click()}
                        className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>🖼️</span> Galería
                      </button>
                    </div>
                  </div>
                </div>

                {/* Healthy Plate Presets for Quick Selection */}
                <div>
                  <span className="text-[9px] font-bold text-gray-600 block mb-1">
                    O selecciona de fotos de platillos saludables:
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {HEALTHY_PLATE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditImage(p.url)}
                        className={`w-full h-11 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          editImage === p.url
                            ? 'ring-2 ring-emerald-500 border-transparent scale-102 shadow-2xs'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        title={p.name}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* External URL option */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowEditUrlInput(!showEditUrlInput)}
                    className="text-[9px] font-bold text-emerald-800 underline cursor-pointer"
                  >
                    {showEditUrlInput ? 'Ocultar URL externa' : '+ O ingresar URL externa'}
                  </button>
                  {showEditUrlInput && (
                    <div className="flex gap-1 mt-1">
                      <input
                        type="url"
                        value={editCustomUrl}
                        onChange={(e) => setEditCustomUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 p-1 text-[11px] rounded-lg border border-gray-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (editCustomUrl.trim()) {
                            setEditImage(editCustomUrl.trim());
                            setEditCustomUrl('');
                          }
                        }}
                        className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Prep time, calories, macros */}
              <div className="grid grid-cols-5 gap-1.5">
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-gray-700 block mb-0.5">Tiempo</label>
                  <input
                    type="text"
                    value={editPrepTime}
                    onChange={(e) => setEditPrepTime(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                    placeholder="15 min"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-gray-700 block mb-0.5">Calorías</label>
                  <input
                    type="number"
                    value={editCalories}
                    onChange={(e) => setEditCalories(Number(e.target.value))}
                    className="w-full p-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-gray-700 block mb-0.5">Proteína</label>
                  <input
                    type="text"
                    value={editProtein}
                    onChange={(e) => setEditProtein(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-gray-700 block mb-0.5">Carbos</label>
                  <input
                    type="text"
                    value={editCarbs}
                    onChange={(e) => setEditCarbs(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[9px] font-bold text-gray-700 block mb-0.5">Grasas</label>
                  <input
                    type="text"
                    value={editFats}
                    onChange={(e) => setEditFats(e.target.value)}
                    className="w-full p-1.5 text-xs font-bold rounded-xl border border-gray-300 bg-white text-center"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Ingredientes (separados por coma)
                </label>
                <input
                  type="text"
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              {/* Athlete Benefit */}
              <div>
                <label className="text-[10px] font-bold text-gray-700 block mb-0.5">
                  Beneficio para el Rendimiento Deportivo
                </label>
                <input
                  type="text"
                  value={editBenefit}
                  onChange={(e) => setEditBenefit(e.target.value)}
                  className="w-full p-2 text-xs font-medium rounded-xl border border-gray-300 bg-white"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setEditingRecipe(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <span>✓</span> Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipe Modal for Full Inspection */}
      {activeRecipeModal && (
        <RecipeModal
          recipe={activeRecipeModal}
          onClose={() => setActiveRecipeModal(null)}
          onDelete={(id) => {
            handleDeleteRecipe(id);
            setActiveRecipeModal(null);
          }}
          canDelete={true}
        />
      )}

      {/* Fullscreen Photo Viewer Modal for Athlete's Meals */}
      <PhotoViewerModal
        isOpen={Boolean(viewingMealPhoto)}
        photoUrl={viewingMealPhoto?.photoUrl}
        title={viewingMealPhoto?.title}
        time={viewingMealPhoto?.time}
        description={viewingMealPhoto?.description}
        onClose={() => setViewingMealPhoto(null)}
      />
    </div>
  );
};
