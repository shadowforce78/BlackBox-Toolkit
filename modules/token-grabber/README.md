# Discord Token Grabber

## État actuel

Ce script JavaScript peut détecter la présence de tokens Discord chiffrés mais ne peut pas les déchiffrer complètement car cela nécessite les APIs Windows DPAPI qui ne sont pas disponibles en JavaScript.

## Tokens détectés

Le script a trouvé des tokens chiffrés avec le préfixe `dQw4w9WgXcQ:` dans les fichiers LevelDB de Discord.

## Solution complète en Python

Pour un déchiffrement complet, utilisez le script Python suivant qui utilise `win32crypt` et `pycryptodome`:

```python
# Voir le script Python complet dans le fichier discord_token_grabber.py
```

## Utilisation

### JavaScript (détection seulement)
```bash
node index.js
```

### Python (déchiffrement complet)
```bash
python discord_token_grabber.py
```

## Exigences Python

```bash
pip install pypiwin32 pycryptodome
```

## Fonctionnalités

- ✅ Détection des tokens chiffrés
- ✅ Support multi-navigateur  
- ✅ Support Discord (toutes versions)
- ❌ Déchiffrement complet (nécessite Python)
- ❌ Support macOS (limitation du script Python)

## Sécurité

Ce script est à des fins éducatives uniquement. L'utilisation pour récupérer des tokens sans autorisation est illégale.
