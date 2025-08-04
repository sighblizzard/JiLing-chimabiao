/**
 * 毛衣模式测试
 */

import { calculateSizeData } from "../src/services/sizeCalculator.js";

describe("毛衣模式功能", () => {
  test("验证毛衣模式计算功能", () => {
    const testCategory = {
      id: "chest-test",
      name: "胸围",
      type: "chest",
      baseValue: 88,
      baseIncrement: 4
    };

    const settings = { startSize: "S", count: 2 };
    
    // 普通模式
    const normalResult = calculateSizeData(settings, [testCategory], "normal");
    expect(normalResult[0].values[1].value - normalResult[0].values[0].value).toBe(4);
    
    // 毛衣模式 - 递增值应该减半
    const sweaterResult = calculateSizeData(settings, [testCategory], "sweater");
    expect(sweaterResult[0].values[1].value - sweaterResult[0].values[0].value).toBe(2);
  });
});
