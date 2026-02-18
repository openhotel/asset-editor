import { FurnitureData, SpriteSheet } from "shared/types";
import { FurnitureDirection, FurnitureType } from "shared/enums";
import { ulid } from "ulidx";

export const parseFurniture = (
  $furniture: Partial<FurnitureData>,
  sheet: SpriteSheet,
): FurnitureData => {
  const furniture = structuredClone($furniture);

  const furnitureTypes = Object.values(FurnitureType);

  if (!furniture?.type || !furnitureTypes.includes(furniture?.type))
    furniture.type = FurnitureType.FURNITURE;

  const parseDirection = (furnitureDirection: FurnitureDirection) => ({
    textures:
      furniture?.direction?.[furnitureDirection]?.textures
        ?.map(({ texture, bounds, pivot, position, zIndex }) => ({
          texture: sheet.frames[texture] ? texture : null,
          bounds: {
            width: bounds?.width ?? 0,
            height: bounds?.height ?? 0,
          },
          pivot: {
            x: pivot?.x ?? 0,
            y: pivot?.y ?? 0,
          },
          position: {
            x: position?.x ?? 0,
            z: position?.z ?? 0,
          },
          zIndex: zIndex ?? 0,
        }))
        .filter((texture) => texture.texture) ?? [],
  });

  return {
    id: furniture?.id ?? "",
    type: furniture.type,
    revision: ulid(),
    icon: {
      texture: furniture?.icon?.texture ?? "",
      bounds: {
        width: furniture?.icon?.bounds?.width ?? 0,
        height: furniture?.icon?.bounds?.height ?? 0,
      },
    },
    size: {
      width: furniture?.size?.width ?? 0,
      height: furniture?.size?.height ?? 0,
      depth:
        furniture.type === FurnitureType.FURNITURE
          ? furniture?.size?.depth ?? 0
          : 0,
    },
    direction: {
      [FurnitureDirection.NORTH]: parseDirection(FurnitureDirection.NORTH),
      [FurnitureDirection.EAST]: parseDirection(FurnitureDirection.EAST),
      ...(furniture.type === FurnitureType.FURNITURE
        ? {
            [FurnitureDirection.SOUTH]: parseDirection(
              FurnitureDirection.SOUTH,
            ),
            [FurnitureDirection.WEST]: parseDirection(FurnitureDirection.WEST),
          }
        : {}),
    },
    actions:
      furniture?.actions
        ?.filter((action) => action?.id && action?.states?.length > 0)
        .map((action) => {
          const stateTextures: Record<string, string> = {};
          for (const state of action.states) {
            const texture = action.stateTextures?.[state];
            if (texture && sheet.frames[texture]) {
              stateTextures[state] = texture;
            }
          }
          return {
            id: action.id,
            label: action.label ?? action.id,
            states: action.states,
            defaultState: action.defaultState ?? action.states[0] ?? "",
            stateTextures,
          };
        }) ?? [],
  };
};
