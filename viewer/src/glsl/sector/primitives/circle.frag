@include "../../base/updateFragmentColor.glsl"
@include "../../base/determineVisibility.glsl"
@include "../../base/determineColor.glsl"
@include "../../base/isSliced.glsl"

varying float v_treeIndex;
varying vec2 v_xy;
varying vec3 v_color;
varying vec3 v_normal;

uniform sampler2D colorDataTexture;
uniform sampler2D overrideVisibilityPerTreeIndex;
uniform sampler2D matCapTexture;

uniform vec2 dataTextureSize;

uniform int renderMode;

varying vec3 vViewPosition;

void main() {
    if (!determineVisibility(colorDataTexture, dataTextureSize, v_treeIndex, renderMode)) {
        discard;
    }

    if (isSliced(vViewPosition)) {
        discard;
    }

    vec4 color = determineColor(v_color, colorDataTexture, dataTextureSize, v_treeIndex);
    float dist = dot(v_xy, v_xy);
    vec3 normal = normalize( v_normal );
    if (dist > 0.25)
      discard;

    updateFragmentColor(renderMode, color, v_treeIndex, normal, gl_FragCoord.z, matCapTexture);
}
