// World View Projection matrix that will transform the input vertices
// to screen space.
float4x4 worldViewProjection : WorldViewProjection;

// input parameters for our vertex shader
struct VertexShaderInput {
  float4 position : POSITION;
};

// input parameters for our pixel shader
struct PixelShaderInput {
  float4 position : POSITION;
};

/**
 * The vertex shader simply transforms the input vertices to screen space.
 */
PixelShaderInput vertexShaderFunction(VertexShaderInput input) {
  PixelShaderInput output;

  // Multiply the vertex positions by the worldViewProjection matrix to
  // transform them to screen space.
  output.position = mul(input.position, worldViewProjection);
  return output;
}

/**
 * This pixel shader just returns the color red.
 */
float4 pixelShaderFunction(PixelShaderInput input): COLOR {
  return float4(1, 0, 0, 1);  // Red.
}

// Here we tell our effect file *which* functions are
// our vertex and pixel shaders.

// #o3d VertexShaderEntryPoint vertexShaderFunction
// #o3d PixelShaderEntryPoint pixelShaderFunction
// #o3d MatrixLoadOrder RowMajor